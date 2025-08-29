/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const { getResultActivity, getCanIncludeTodayFlag } = require("./common");

const getWeeklyAcitivitesByNumberOfOccurences = ({
  start_date,
  sortedRepeatingDays,
  start_time,
  end_by_time,
  end_after_occurences,
  repeating_every
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");
  const date_diff = repeating_every * 7;
  const resultActivities = [];
  for (
    let start = startIST.clone(), occurence_count = 0;
    occurence_count < end_after_occurences;
    start.add(date_diff, "days")
  ) {
    sortedRepeatingDays.forEach((repeatingDay, index) => {
      if (index === 0) {
        if (occurence_count < end_after_occurences) {
          const activity_date = start.format("YYYY-MM-DD");
          resultActivities.push(
            getResultActivity({ activity_date, start_time, end_by_time })
          );
          occurence_count += 1;
        }
      } else if (occurence_count < end_after_occurences) {
        const JSDay = repeatingDay - 1;
        const daysToAdd = JSDay - start.day();
        const activity_date = start
          .clone()
          .add(daysToAdd, "days")
          .format("YYYY-MM-DD");

        resultActivities.push(
          getResultActivity({ activity_date, start_time, end_by_time })
        );
        occurence_count += 1;
      }
    });
  }

  return resultActivities;
};

const getTypeWeeklyAcitivites = ({
  start_date,
  repeating_every,
  sortedRepeatingDays,
  startRepeatingDay,
  start_time,
  end_by_time,
  end_after_occurences
}) => {
  const startIST = momentTimezone.tz(start_date, "YYYY-MM-DD", "Asia/Calcutta");

  if (sortedRepeatingDays[0] === startRepeatingDay) {
    return getWeeklyAcitivitesByNumberOfOccurences({
      start_date,
      sortedRepeatingDays,
      start_time,
      end_by_time,
      end_after_occurences,
      repeating_every
    });
  }

  const repeatingDaysAfterOrEqualsStartingDay = sortedRepeatingDays.filter(
    repeatingDay => repeatingDay >= startRepeatingDay
  );

  const resultActivities = [];
  repeatingDaysAfterOrEqualsStartingDay.forEach((repeatingDay, index) => {
    if (index === 0) {
      const activity_date = startIST.format("YYYY-MM-DD");
      resultActivities.push(
        getResultActivity({ activity_date, start_time, end_by_time })
      );
    } else {
      const JSDay = repeatingDay - 1;
      const daysToAdd = JSDay - startIST.day();
      const activity_date = startIST
        .clone()
        .add(daysToAdd, "days")
        .format("YYYY-MM-DD");
      resultActivities.push(
        getResultActivity({ activity_date, start_time, end_by_time })
      );
    }
  });

  const JSDay = sortedRepeatingDays[0] - 1;

  const daysToAddToGoToNextApplicableWeek =
    7 * repeating_every - startIST.day() + JSDay;

  const otherResultActivities = getWeeklyAcitivitesByNumberOfOccurences({
    start_date: startIST
      .clone()
      .add(daysToAddToGoToNextApplicableWeek, "days")
      .format("YYYY-MM-DD"),
    sortedRepeatingDays,
    start_time,
    end_by_time,
    end_after_occurences: end_after_occurences - resultActivities.length,
    repeating_every
  });

  return [...resultActivities, ...otherResultActivities];
};

const getStartDateFromInput = ({
  sortedRepeatingDays,
  start_datetime,
  end_by_time,
  repeating_every
}) => {
  const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");
  for (const repeatingDay of sortedRepeatingDays) {
    const JSDay = repeatingDay - 1; // As in JS days are 0,1,2,3,4,5,6. Where 0 is Sunday

    if (JSDay === ISTStartDateTime.day()) {
      const canIncludeToday = getCanIncludeTodayFlag({
        scheduled_start_datetime: start_datetime,
        input_start_datetime: start_datetime,
        end_by_time
      });

      if (canIncludeToday) {
        return {
          startDate: ISTStartDateTime.format("YYYY-MM-DD"),
          startRepeatingDay: repeatingDay
        };
      }
    }

    if (JSDay > ISTStartDateTime.day()) {
      const daysToAdd = JSDay - ISTStartDateTime.day();
      return {
        startDate: ISTStartDateTime.clone()
          .add(daysToAdd, "days")
          .format("YYYY-MM-DD"),
        startRepeatingDay: repeatingDay
      };
    }
  }

  const JSDay = sortedRepeatingDays[0] - 1;
  const daysToAdd = 7 * repeating_every - ISTStartDateTime.day() + JSDay;

  return {
    startDate: ISTStartDateTime.clone()
      .add(daysToAdd, "days")
      .format("YYYY-MM-DD"),
    startRepeatingDay: sortedRepeatingDays[0]
  };
};

const getTypeWeeklyAcitivitesWithRepeatingOn = ({
  start_datetime,
  repeating_every,
  repeating_on,
  start_time,
  end_by_time,
  end_after_occurences
}) => {
  const sortedRepeatingDays = repeating_on.sort((a, b) => a - b);
  const { startDate, startRepeatingDay } = getStartDateFromInput({
    sortedRepeatingDays,
    start_datetime,
    end_by_time,
    repeating_every
  });

  return getTypeWeeklyAcitivites({
    start_date: startDate,
    repeating_every,
    sortedRepeatingDays,
    startRepeatingDay,
    start_time,
    end_by_time,
    end_after_occurences
  });
};

module.exports = { getTypeWeeklyAcitivitesWithRepeatingOn };
