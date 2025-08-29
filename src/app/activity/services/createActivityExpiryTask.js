const momentTimezone = require("moment-timezone");
const activityRepo = require("../repository/activity");

const { getBatches } = require("../../commons/helpers");

const getTimeDiffInSecondsBetweenCurrentTimeIstAndExpiryTime = ({
  expiry_time
}) => {
  const currentTimeUTC = momentTimezone(new Date().toISOString());
  const istCurrentTime = currentTimeUTC
    .tz("America/New_York")
    .clone()
    .tz("Asia/Calcutta");

  const istEndTime = momentTimezone.tz(
    `${istCurrentTime.format("YYYY-MM-DD")} ${expiry_time}`,
    "YYYY-MM-DD HH:mm:ss",
    "Asia/Calcutta"
  );

  const difference = momentTimezone.duration(istEndTime.diff(istCurrentTime));
  return Math.round(difference.asSeconds());
};

function createActivityExpiryTaskService(fastify) {
  const { getPendingActivityListAboutToExpire } = activityRepo(fastify);

  const createCloudTaskInBatches = async ({
    pendingActivitiesAboutToExpireList,
    logTrace
  }) => {
    const pendingActivityBatches = getBatches({
      input: pendingActivitiesAboutToExpireList,
      BATCH_SIZE: 100
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const currentBatch of pendingActivityBatches) {
      const promises = currentBatch.map(item => {
        const { expiry_time } = item;

        const taskPromise = fastify.createCloudTask({
          queue: fastify.config.ACTIVITY_MANAGER_QUEUE,
          logTrace,
          url: `${fastify.config.SERVICE_BASE_URL}/v1/activities/expiry-task-execution`,
          httpMethod: "POST",
          delayInSeconds:
            getTimeDiffInSecondsBetweenCurrentTimeIstAndExpiryTime({
              expiry_time
            }),
          payload: item
        });

        return taskPromise;
      });

      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises);
    }
  };

  return async ({ logTrace }) => {
    const dateTimeNowIST = momentTimezone(new Date().toISOString()).tz(
      "Asia/Calcutta"
    );
    const dateNow = dateTimeNowIST.format("YYYY-MM-DD");

    const timeNow = dateTimeNowIST.format("HH:mm:ss");

    const pendingActivitiesAboutToExpireList =
      await getPendingActivityListAboutToExpire.call(fastify.knex, {
        input: { inputDate: dateNow, inputTime: timeNow },
        logTrace
      });

    await createCloudTaskInBatches({
      pendingActivitiesAboutToExpireList,
      logTrace
    });

    return { success: true };
  };
}
module.exports = createActivityExpiryTaskService;
