/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const { getResultActivity, getCanIncludeTodayFlag } = require("./common");

const getAcitivitesBetweenMonths = ({
  start_date,
  end_date,
  start_time,
  end_by_time,
  date_of_month,
  month_diff
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");
  const endIST = momentTimezone.tz(end_date, "YYYY-MM-DD", "Asia/Calcutta");

  const resultActivities = [];

  for (
    let start = startIST.clone();
    endIST.isAfter(start);
    start.add(month_diff, "months")
  ) {
    // when date_of_month is 31
    // When going from Jan 31, to Feb 28, then to March 28
    // Here March need to reset back to 31
    if (start.date() !== date_of_month) {
      const settedDate = start.clone().date(date_of_month);

      // Here March need to reset back to 31
      if (settedDate.date() === date_of_month) {
        start.date(date_of_month); // Reseeting line
        const activity_date = start.format("YYYY-MM-DD");
        resultActivities.push(
          getResultActivity({ activity_date, start_time, end_by_time })
        );
      } else {
        // Setting start to last date of this month
        start.date(date_of_month).date(0);
        // Here Feb need to leave as it is, as 31 doesn't exist in Feb
        const activity_date = start.format("YYYY-MM-DD");
        resultActivities.push(
          getResultActivity({ activity_date, start_time, end_by_time })
        );
      }
    } else {
      const activity_date = start.format("YYYY-MM-DD");
      resultActivities.push(
        getResultActivity({ activity_date, start_time, end_by_time })
      );
    }
  }

  return resultActivities;
};

const getTypeMonthlyAcitivites = ({
  scheduled_start_datetime,
  start_datetime,
  repeating_every,
  start_time,
  end_by_time,
  end_date,
  date_of_month
}) => {
  const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");

  const canIncludeToday = getCanIncludeTodayFlag({
    scheduled_start_datetime,
    input_start_datetime: start_datetime,
    end_by_time
  });

  if (canIncludeToday) {
    return getAcitivitesBetweenMonths({
      start_date: ISTStartDateTime.format("YYYY-MM-DD"),
      end_date,
      start_time,
      end_by_time,
      date_of_month,
      month_diff: repeating_every
    });
  }

  return getAcitivitesBetweenMonths({
    start_date: ISTStartDateTime.add(1 * repeating_every, "months").format(
      "YYYY-MM-DD"
    ),
    end_date,
    start_time,
    end_by_time,
    date_of_month,
    month_diff: repeating_every
  });
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

const getTypeMonthlyAcitivitesWithRepeatingOn = ({
  start_datetime,
  repeating_every,
  repeating_on,
  start_time,
  end_by_time,
  end_date
}) => {
  const resultActivities = repeating_on.flatMap(value => {
    const date_of_month = value;
    const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");
    const settedDate = ISTStartDateTime.clone().date(date_of_month);

    // case0: when setting up the date changes the date
    if (settedDate.date() !== date_of_month) {
      const lastDateOfMonth = ISTStartDateTime.clone().add(1, "months").date(0);
      return getTypeMonthlyAcitivites({
        scheduled_start_datetime: start_datetime,
        start_datetime: lastDateOfMonth.toISOString(),
        repeating_every,
        start_time,
        end_by_time,
        end_date,
        date_of_month
      });
    }

    // case1: when setting up the date doesn't change the date but is equal to start date
    if (settedDate.date() === ISTStartDateTime.date()) {
      return getTypeMonthlyAcitivites({
        scheduled_start_datetime: start_datetime,
        start_datetime: ISTStartDateTime.toISOString(),
        repeating_every,
        start_time,
        end_by_time,
        end_date,
        date_of_month
      });
    }

    // case2: when setting up the date doesn't change the date but is future
    if (settedDate.date() > ISTStartDateTime.date()) {
      return getTypeMonthlyAcitivites({
        scheduled_start_datetime: start_datetime,
        start_datetime: settedDate.toISOString(),
        repeating_every,
        start_time,
        end_by_time,
        end_date,
        date_of_month
      });
    }
    // case3: when setting up the date doesn't change the date but is past

    const settedDateNextRepeatingMonth = settedDate.add(
      repeating_every,
      "months"
    );

    // subcase1: after increment, get a date that is not matching with given date_of_month
    // In this case, need to get the last date of month and process it
    if (settedDateNextRepeatingMonth.date() !== date_of_month) {
      // This is get the last date of settedDateNextRepeatingMonth
      const lastDateOfNextMonth = settedDateNextRepeatingMonth
        .clone()
        .add(1, "months")
        .date(0);
      return getTypeMonthlyAcitivites({
        scheduled_start_datetime: start_datetime,
        start_datetime: lastDateOfNextMonth.toISOString(),
        repeating_every,
        start_time,
        end_by_time,
        end_date,
        date_of_month
      });
    }

    // subcase1: after increment, get a date that is matching with given date_of_month
    // In this case, need to proceed with next month date
    return getTypeMonthlyAcitivites({
      scheduled_start_datetime: start_datetime,
      start_datetime: settedDateNextRepeatingMonth.toISOString(),
      repeating_every,
      start_time,
      end_by_time,
      end_date,
      date_of_month
    });
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
