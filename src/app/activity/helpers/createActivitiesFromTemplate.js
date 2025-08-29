/* eslint-disable complexity */
const dailyActivityHelpersWithEndDate = require("./lib/dailyActivityHelpersWithEndDate");
const weeklyActivityHelpersWithEndDate = require("./lib/weeklyActivityHelpersWithEndDate");
const monthlyActivityHelpersWithEndDate = require("./lib/monthlyActivityHelpersWithEndDate");

const dailyActivityHelpersWithOccurences = require("./lib/dailyActivityHelpersWithOccurences");
const weeklyActivityHelpersWithOccurences = require("./lib/weeklyActivityHelpersWithOccurences");
const monthlyActivityHelpersWithOccurences = require("./lib/monthlyActivityHelpersWithOccurences");

const oneTimeActivityHelpers = require("./lib/oneTimeActivityHelpers");

const getListOfAcitivityDateAndTimeFromTemplate = ({
  start_datetime,
  repeat_info,
  start_time,
  end_by_time
}) => {
  const {
    type,
    repeating_every,
    repeating_on = [],
    end_by: { end_date, end_after_occurences }
  } = repeat_info;

  if (end_date) {
    // eslint-disable-next-line default-case
    switch (type) {
      case "DAILY": {
        return dailyActivityHelpersWithEndDate.getTypeDailyAcitivites({
          start_datetime,
          repeating_every,
          start_time,
          end_by_time,
          end_date
        });
      }
      case "WEEKLY": {
        return weeklyActivityHelpersWithEndDate.getTypeWeeklyAcitivitesWithRepeatingOn(
          {
            start_datetime,
            repeating_every,
            repeating_on,
            start_time,
            end_by_time,
            end_date
          }
        );
      }
      case "MONTHLY": {
        return monthlyActivityHelpersWithEndDate.getTypeMonthlyAcitivitesWithRepeatingOn(
          {
            start_datetime,
            repeating_every,
            repeating_on,
            start_time,
            end_by_time,
            end_date
          }
        );
      }
      default: {
        return dailyActivityHelpersWithEndDate.getTypeDailyAcitivites({
          start_datetime,
          repeating_every,
          start_time,
          end_by_time,
          end_date
        });
      }
    }
  }

  // eslint-disable-next-line default-case
  switch (type) {
    case "DAILY": {
      return dailyActivityHelpersWithOccurences.getTypeDailyAcitivites({
        start_datetime,
        repeating_every,
        start_time,
        end_by_time,
        end_after_occurences
      });
    }
    case "WEEKLY": {
      return weeklyActivityHelpersWithOccurences.getTypeWeeklyAcitivitesWithRepeatingOn(
        {
          start_datetime,
          repeating_every,
          repeating_on,
          start_time,
          end_by_time,
          end_after_occurences
        }
      );
    }
    case "MONTHLY": {
      return monthlyActivityHelpersWithOccurences.getTypeMonthlyAcitivitesWithRepeatingOn(
        {
          start_datetime,
          repeating_every,
          repeating_on,
          start_time,
          end_by_time,
          end_after_occurences
        }
      );
    }
    default: {
      return dailyActivityHelpersWithOccurences.getTypeDailyAcitivites({
        start_datetime,
        repeating_every,
        start_time,
        end_by_time,
        end_after_occurences
      });
    }
  }
};

const getOneTimeAcitivityDateAndTimeFromTemplate = ({
  start_datetime,
  start_time,
  end_by_time
}) => {
  return oneTimeActivityHelpers.getOneTimeActivity({
    start_datetime,
    start_time,
    end_by_time
  });
};

module.exports = {
  getListOfAcitivityDateAndTimeFromTemplate,
  getOneTimeAcitivityDateAndTimeFromTemplate
};
