/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const {
  getAcitivitesByNumberOfOccurences,
  getCanIncludeTodayFlag
} = require("./common");

const getTypeDailyAcitivites = ({
  start_datetime,
  repeating_every,
  start_time,
  end_by_time,
  end_after_occurences
}) => {
  const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");

  const canIncludeToday = getCanIncludeTodayFlag({
    scheduled_start_datetime: start_datetime,
    input_start_datetime: start_datetime,
    end_by_time
  });

  if (canIncludeToday) {
    return getAcitivitesByNumberOfOccurences({
      start_date: ISTStartDateTime.format("YYYY-MM-DD"),
      end_after_occurences,
      start_time,
      end_by_time,
      date_diff: repeating_every
    });
  }

  return getAcitivitesByNumberOfOccurences({
    start_date: ISTStartDateTime.add(1, "days").format("YYYY-MM-DD"),
    end_after_occurences,
    start_time,
    end_by_time,
    date_diff: repeating_every
  });
};

module.exports = {
  getTypeDailyAcitivites
};
