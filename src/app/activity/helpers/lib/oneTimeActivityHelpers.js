/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const { getResultActivity } = require("./common");

const getOneTimeActivity = ({ start_datetime, start_time, end_by_time }) => {
  const activity_date = momentTimezone(start_datetime)
    .tz("Asia/Calcutta")
    .format("YYYY-MM-DD");
  const activity = getResultActivity({
    activity_date,
    start_time,
    end_by_time
  });
  return [activity];
};

module.exports = {
  getOneTimeActivity
};
