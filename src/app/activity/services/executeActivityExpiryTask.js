const activityRepo = require("../repository/activity");

function executeActivityExpiryTaskService(fastify) {
  const { updateActivityAsExpiredIfNotCompleted } = activityRepo(fastify);

  return async ({ body, logTrace }) => {
    const { activity_id } = body;
    await updateActivityAsExpiredIfNotCompleted.call(fastify.knex, {
      activity_id,
      logTrace
    });
    return { success: true };
  };
}
module.exports = executeActivityExpiryTaskService;
