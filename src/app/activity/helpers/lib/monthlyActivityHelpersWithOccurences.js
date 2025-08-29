/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const { getResultActivity, getCanIncludeTodayFlag } = require("./common");

const getMonthlyAcitivitesByNumberOfOccurences = ({
  start_date,
  sortedRepeatingDates,
  start_time,
  end_by_time,
  end_after_occurences,
  repeating_every
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");

  const month_diff = repeating_every;
  const resultActivityMap = new Map();

  for (
    let start = startIST.clone();
    resultActivityMap.size < end_after_occurences;
    start.add(month_diff, "months")
  ) {
    sortedRepeatingDates.forEach((date_of_month, index) => {
      if (index === 0) {
        // when date_of_month is 31
        // When going from Jan 31, to Feb 28, then to March 28
        // Here March need to reset back to 31
        if (start.date() !== date_of_month) {
          const settedDate = start.clone().date(date_of_month);

          // Here March need to reset back to 31
          if (settedDate.date() === date_of_month) {
            start.date(date_of_month); // Reseeting line
            if (resultActivityMap.size < end_after_occurences) {
              const activity_date = start.format("YYYY-MM-DD");
              resultActivityMap.set(
                activity_date,
                getResultActivity({ activity_date, start_time, end_by_time })
              );
            }
          } else if (resultActivityMap.size < end_after_occurences) {
            // Here Feb need to leave as it is, as 31 doesn't exist in Feb
            const activity_date = start.format("YYYY-MM-DD");
            resultActivityMap.set(
              activity_date,
              getResultActivity({ activity_date, start_time, end_by_time })
            );
          }
        } else if (resultActivityMap.size < end_after_occurences) {
          const activity_date = start.format("YYYY-MM-DD");
          resultActivityMap.set(
            activity_date,
            getResultActivity({ activity_date, start_time, end_by_time })
          );
        }
      } else {
        const settedDate = start.clone().date(date_of_month);
        if (settedDate.date() === date_of_month) {
          if (resultActivityMap.size < end_after_occurences) {
            const activity_date = settedDate.format("YYYY-MM-DD");
            resultActivityMap.set(
              activity_date,
              getResultActivity({ activity_date, start_time, end_by_time })
            );
          }
        } else if (resultActivityMap.size < end_after_occurences) {
          // If setted Date is not contained by this month, then take last Date of this month
          const lastDateOfThisMonth = settedDate.clone().date(0);
          const activity_date = lastDateOfThisMonth.format("YYYY-MM-DD");
          resultActivityMap.set(
            activity_date,
            getResultActivity({ activity_date, start_time, end_by_time })
          );
        }
      }
    });
  }

  return [...resultActivityMap.values()];
};

const getTypeMonthlyAcitivites = ({
  start_date,
  repeating_every,
  sortedRepeatingDates,
  startRepeatingDate,
  start_time,
  end_by_time,
  end_after_occurences
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");

  if (sortedRepeatingDates[0] === startRepeatingDate) {
    return getMonthlyAcitivitesByNumberOfOccurences({
      start_date,
      sortedRepeatingDates,
      start_time,
      end_by_time,
      end_after_occurences,
      repeating_every
    });
  }

  const repeatingDatesAfterOrEqualsStartingDate = sortedRepeatingDates.filter(
    repeatingDate => repeatingDate >= startRepeatingDate
  );

  const resultAcitivtyMap = new Map();
  repeatingDatesAfterOrEqualsStartingDate.forEach(date_of_month => {
    const settedDate = startIST.clone().date(date_of_month);
    if (settedDate.date() === date_of_month) {
      const activity_date = settedDate.format("YYYY-MM-DD");

      if (!resultAcitivtyMap.has(activity_date)) {
        resultAcitivtyMap.set(
          activity_date,
          getResultActivity({ activity_date, start_time, end_by_time })
        );
      }
    } else {
      // If setted Date is not contained by this month, then take last Date of this month
      const lastDateOfThisMonth = settedDate.clone().date(0);
      const activity_date = lastDateOfThisMonth.format("YYYY-MM-DD");
      if (!resultAcitivtyMap.has(activity_date)) {
        resultAcitivtyMap.set(
          activity_date,
          getResultActivity({ activity_date, start_time, end_by_time })
        );
      }
    }
  });

  const firstRepeatingDate = sortedRepeatingDates[0];

  const settedDate = startIST.clone().date(firstRepeatingDate);
  const settedDateNextRepeatingMonth = settedDate.add(
    1 * repeating_every,
    "months"
  );

  const otherResultActivities = getMonthlyAcitivitesByNumberOfOccurences({
    start_date: settedDateNextRepeatingMonth.format("YYYY-MM-DD"),
    sortedRepeatingDates,
    start_time,
    end_by_time,
    end_after_occurences: end_after_occurences - resultAcitivtyMap.size,
    repeating_every
  });

  return [...resultAcitivtyMap.values(), ...otherResultActivities];
};

const removeActivitesThatAreOnSameDayTwiceAndMakeItUniquePerDay =
  activities => {
    const activityMap = {};

    activities.forEach(activity => {
      const { activity_date } = activity;
      activityMap[activity_date] = activity;
    });

    return Object.values(activityMap);
  };

const getStartDateFromInput = ({
  sortedRepeatingDates,
  start_datetime,
  repeating_every,
  end_by_time
}) => {
  const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");
  for (const date_of_month of sortedRepeatingDates) {
    const settedDate = ISTStartDateTime.clone().date(date_of_month);
    if (settedDate.date() !== date_of_month) {
      const lastDateOfMonth = ISTStartDateTime.clone().add(1, "months").date(0);
      return {
        startDate: lastDateOfMonth.format("YYYY-MM-DD"),
        startRepeatingDate: date_of_month
      };
    }
    if (settedDate.date() === ISTStartDateTime.date()) {
      const canIncludeToday = getCanIncludeTodayFlag({
        scheduled_start_datetime: start_datetime,
        input_start_datetime: start_datetime,
        end_by_time
      });

      if (canIncludeToday) {
        return {
          startDate: settedDate.format("YYYY-MM-DD"),
          startRepeatingDate: date_of_month
        };
      }
    }
    if (settedDate.date() > ISTStartDateTime.date()) {
      return {
        startDate: settedDate.format("YYYY-MM-DD"),
        startRepeatingDate: date_of_month
      };
    }
  }

  const firstRepeatingDate = sortedRepeatingDates[0];

  const settedDate = ISTStartDateTime.clone().date(firstRepeatingDate);
  const settedDateNextRepeatingMonth = settedDate
    .clone()
    .add(1 * repeating_every, "months");

  if (settedDateNextRepeatingMonth.date() !== firstRepeatingDate) {
    // This line is to get Last Date of settedDateNextRepeatingMonth
    const lastDateOfNextMonth = settedDateNextRepeatingMonth
      .clone()
      .add(1, "months")
      .date(0);
    return {
      startDate: lastDateOfNextMonth.format("YYYY-MM-DD"),
      startRepeatingDate: firstRepeatingDate
    };
  }
  return {
    startDate: settedDateNextRepeatingMonth.format("YYYY-MM-DD"),
    startRepeatingDate: firstRepeatingDate
  };
};

const getTypeMonthlyAcitivitesWithRepeatingOn = ({
  start_datetime,
  repeating_every,
  repeating_on,
  start_time,
  end_by_time,
  end_after_occurences
}) => {
  const sortedRepeatingDates = repeating_on.sort((a, b) => a - b);
  const { startDate, startRepeatingDate } = getStartDateFromInput({
    sortedRepeatingDates,
    start_datetime,
    repeating_every,
    end_by_time
  });

  const resultActivities = getTypeMonthlyAcitivites({
    start_date: startDate,
    repeating_every,
    sortedRepeatingDates,
    startRepeatingDate,
    start_time,
    end_by_time,
    end_after_occurences
  });

  const uniqiueActivitiesPerDay =
    removeActivitesThatAreOnSameDayTwiceAndMakeItUniquePerDay(resultActivities);

  return uniqiueActivitiesPerDay.sort(
    (a, b) =>
      new Date(a.activity_start_datetime).getTime() -
      new Date(b.activity_start_datetime).getTime()
  );
};

module.exports = {
  getTypeMonthlyAcitivitesWithRepeatingOn
};
