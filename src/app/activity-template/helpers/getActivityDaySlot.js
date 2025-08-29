const momentTimezone = require("moment-timezone");

function getTimeInIST(time, format) {
  return momentTimezone(time, format).tz("Asia/Calcutta");
}
function getActivityDaySlot(start_time) {
  const morningEnd = getTimeInIST("12:00:00", "HH:mm:ss");
  const afternoonEnd = getTimeInIST("15:00:00", "HH:mm:ss");

  const startTimeInCalcutta = getTimeInIST(start_time, "HH:mm:ss");

  if (startTimeInCalcutta.isBefore(morningEnd)) {
    return "MORNING";
  }
  if (startTimeInCalcutta.isBefore(afternoonEnd)) {
    return "AFTERNOON";
  }
  return "EVENING";
}

module.exports = { getActivityDaySlot };
