const momentTimezone = require("moment-timezone");

const getDurationInMins = ({ start_time, end_by_time }) => {
  const [startHH, startMM, startSS] = start_time.split(":");
  const [endHH, endMM, endSS] = end_by_time.split(":");

  const startNow = new Date();
  const endNow = new Date();
  startNow.setHours(startHH);
  startNow.setMinutes(startMM);
  startNow.setSeconds(startSS);

  endNow.setHours(endHH);
  endNow.setMinutes(endMM);
  endNow.setSeconds(endSS);

  const timeDifferenceInMinutes = Math.floor((endNow - startNow) / 1000 / 60);
  return timeDifferenceInMinutes;
};

const getStartDateTime = ({ start_from }) => {
  const todayDateObjIST = momentTimezone(new Date().toISOString()).tz(
    "Asia/Calcutta"
  );

  const inputDateObjIST = momentTimezone.tz(
    `${start_from}`,
    "YYYY-MM-DD",
    "Asia/Calcutta"
  );

  if (start_from === todayDateObjIST.format("YYYY-MM-DD")) {
    return new Date().toISOString();
  }

  return inputDateObjIST.toISOString();
};

module.exports = { getDurationInMins, getStartDateTime };
