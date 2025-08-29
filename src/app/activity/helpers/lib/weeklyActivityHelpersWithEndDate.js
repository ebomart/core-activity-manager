/* eslint-disable complexity */
/* eslint-disable max-depth */
const momentTimezone = require("moment-timezone");

const {
  getAcitivitesBetweenDates,
  getCanIncludeTodayFlag
} = require("./common");

const getTypeWeeklyAcitivites = ({
  scheduled_start_datetime,
  start_datetime,
  repeating_every,
  start_time,
  end_by_time,
  end_date
}) => {
  const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");

  const canIncludeToday = getCanIncludeTodayFlag({
    scheduled_start_datetime,
    input_start_datetime: start_datetime,
    end_by_time
  });

  if (canIncludeToday) {
    return getAcitivitesBetweenDates({
      start_date: ISTStartDateTime.format("YYYY-MM-DD"),
      end_date,
      start_time,
      end_by_time,
      date_diff: 7 * repeating_every
    });
  }

  return getAcitivitesBetweenDates({
    start_date: ISTStartDateTime.add(7, "days").format("YYYY-MM-DD"), // Need to check if to start from next week or as per repeating_ever var
    end_date,
    start_time,
    end_by_time,
    date_diff: 7 * repeating_every
  });
};

const getTypeWeeklyAcitivitesWithRepeatingOn = ({
  start_datetime,
  repeating_every,
  repeating_on,
  start_time,
  end_by_time,
  end_date
}) => {
  const resultActivities = repeating_on.flatMap(value => {
    const JSDay = value - 1; // As in JS days are 0,1,2,3,4,5,6. Where 0 is Sunday
    const ISTStartDateTime = momentTimezone(start_datetime).tz("Asia/Calcutta");
    if (JSDay === ISTStartDateTime.day()) {
      return getTypeWeeklyAcitivites({
        scheduled_start_datetime: start_datetime,
        start_datetime,
        repeating_every,
        start_time,
        end_by_time,
        end_date
      });
    }
    if (JSDay > ISTStartDateTime.day()) {
      const daysToAdd = JSDay - ISTStartDateTime.day();
      return getTypeWeeklyAcitivites({
        scheduled_start_datetime: start_datetime,
        start_datetime: ISTStartDateTime.clone()
          .add(daysToAdd, "days")
          .toISOString(),
        repeating_every,
        start_time,
        end_by_time,
        end_date
      });
    }
    const daysToAdd = 7 * repeating_every - ISTStartDateTime.day() + JSDay;
    return getTypeWeeklyAcitivites({
      scheduled_start_datetime: start_datetime,
      start_datetime: ISTStartDateTime.clone()
        .add(daysToAdd, "days")
        .toISOString(),
      repeating_every,
      start_time,
      end_by_time,
      end_date
    });
  });

  return resultActivities.sort(
    (a, b) =>
      new Date(a.activity_start_datetime).getTime() -
      new Date(b.activity_start_datetime).getTime()
  );
};

module.exports = { getTypeWeeklyAcitivitesWithRepeatingOn };
