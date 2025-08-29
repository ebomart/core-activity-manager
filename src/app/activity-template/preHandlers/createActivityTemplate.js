const momentTimezone = require("moment-timezone");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");

// eslint-disable-next-line complexity
async function validateActivityTemplateRepeatInfo(request) {
  const { body } = request;
  const {
    repeat_info,
    start_time,
    end_by_time,
    expiry_time,
    start_from,
    type: activity_type
  } = body;

  const ISTInputDate = momentTimezone.tz(
    start_from,
    "YYYY-MM-DD",
    "Asia/Calcutta"
  );

  const ISTToday = momentTimezone.tz(
    momentTimezone(new Date().toISOString())
      .tz("Asia/Calcutta")
      .format("YYYY-MM-DD"),
    "YYYY-MM-DD",
    "Asia/Calcutta"
  );

  if (!ISTInputDate.isSameOrAfter(ISTToday)) {
    throw CustomError.create({
      httpCode: StatusCodes.BAD_REQUEST,
      message: `start_from should be greater than or equals to today's date`,
      property: "/start_from",
      code: "BAD_REQUEST"
    });
  }

  if (!(end_by_time > start_time)) {
    throw CustomError.create({
      httpCode: StatusCodes.BAD_REQUEST,
      message: `end_by_time should be greater than start_time`,
      property: "/end_by_time",
      code: "BAD_REQUEST"
    });
  }

  if (!(expiry_time >= end_by_time)) {
    throw CustomError.create({
      httpCode: StatusCodes.BAD_REQUEST,
      message: `expiry_time should be greater than equals to end_by_time`,
      property: "/expiry_time",
      code: "BAD_REQUEST"
    });
  }

  if (activity_type === "REPEATING") {
    const { type, repeating_on } = repeat_info;

    if (
      (type === "WEEKLY" || type === "MONTHLY") &&
      !repeating_on?.length > 0
    ) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `repeating_on is mandatory when type is WEEKLY`,
        property: "/repeat_info/repeating_on",
        code: "BAD_REQUEST"
      });
    }

    if (type === "WEEKLY") {
      repeating_on.forEach((val, index) => {
        if (![1, 2, 3, 4, 5, 6, 7].includes(val)) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `repeating_on should contain values between 1-7 when type is WEEKLY`,
            property: `/repeat_info/repeating_on/${index}`,
            code: "BAD_REQUEST"
          });
        }
      });
    }

    if (type === "MONTHLY") {
      repeating_on.forEach((val, index) => {
        if (!(val > 0 && val <= 31)) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `repeating_on should contain values between 1-31 when type is MONTHLY`,
            property: `/repeat_info/repeating_on/${index}`,
            code: "BAD_REQUEST"
          });
        }
      });
    }

    if (type === "DAILY" && repeating_on?.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `repeating_on should not be there when type is DAILY`,
        property: `/repeat_info/repeating_on`,
        code: "BAD_REQUEST"
      });
    }
  } else if (ISTInputDate.isSame(ISTToday)) {
    const ISTInputStartDateTime = momentTimezone.tz(
      `${start_from} ${start_time}`,
      "YYYY-MM-DD HH:mm:ss",
      "Asia/Calcutta"
    );

    const ISTTodayNow = momentTimezone(new Date().toISOString()).tz(
      "Asia/Calcutta"
    );

    if (!ISTInputStartDateTime.isAfter(ISTTodayNow)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `start_time is already passed as per today`,
        property: "/start_time",
        code: "BAD_REQUEST"
      });
    }
  }
}

module.exports = { validateActivityTemplateRepeatInfo };
