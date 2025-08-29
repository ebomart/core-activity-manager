/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const getResultActivity = ({ activity_date, start_time, end_by_time }) => {
  return {
    activity_date,
    start_time,
    end_by_time,
    activity_start_datetime: momentTimezone
      .tz(
        `${activity_date} ${start_time}`,
        "YYYY-MM-DD HH:mm:ss",
        "Asia/Calcutta"
      )
      .toISOString()
  };
};

const getAcitivitesBetweenDates = ({
  start_date,
  end_date,
  start_time,
  end_by_time,
  date_diff
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");
  const endIST = momentTimezone.tz(end_date, "YYYY-MM-DD", "Asia/Calcutta");

  const resultActivities = [];

  for (
    let start = startIST.clone();
    endIST.isSameOrAfter(start);
    start.add(date_diff, "days")
  ) {
    const activity_date = start.format("YYYY-MM-DD");

    resultActivities.push(
      getResultActivity({ activity_date, start_time, end_by_time })
    );
  }

  return resultActivities;
};

const getAcitivitesByNumberOfOccurences = ({
  start_date,
  end_after_occurences,
  start_time,
  end_by_time,
  date_diff
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");

  const resultActivities = [];

  for (
    let start = startIST.clone(), occurence_count = 0;
    occurence_count < end_after_occurences;
    start.add(date_diff, "days"), occurence_count += 1
  ) {
    const activity_date = start.format("YYYY-MM-DD");

    resultActivities.push(
      getResultActivity({ activity_date, start_time, end_by_time })
    );
  }

  return resultActivities;
};

const getCanIncludeTodayFlag = ({
  scheduled_start_datetime,
  input_start_datetime,
  end_by_time
}) => {
  const ISTScheduledStartDateTime = momentTimezone(scheduled_start_datetime).tz(
    "Asia/Calcutta"
  );
  const ISTStartDateTime =
    momentTimezone(input_start_datetime).tz("Asia/Calcutta");
  const todayFirstOccurenceEnd = momentTimezone.tz(
    `${ISTStartDateTime.format("YYYY-MM-DD")} ${end_by_time}`,
    "YYYY-MM-DD HH:mm:ss",
    "Asia/Calcutta"
  );

  const isIncludeToday = todayFirstOccurenceEnd.isAfter(
    ISTScheduledStartDateTime
  );

  return isIncludeToday;
};

module.exports = {
  getResultActivity,
  getAcitivitesBetweenDates,
  getAcitivitesByNumberOfOccurences,
  getCanIncludeTodayFlag
};
