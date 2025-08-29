const momentTimezone = require("moment-timezone");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");

const activityRepo = require("../repository/activity");
const acitivityTemplateRepo = require("../../activity-template/repository/activityTemplate");

// eslint-disable-next-line complexity
const validateEvidence = ({ activity_evidences, activity_evidence }) => {
  // eslint-disable-next-line complexity
  activity_evidences.forEach(evidence => {
    const { evidence_type, is_evidence_mandatory } = evidence;
    if (is_evidence_mandatory) {
      // eslint-disable-next-line default-case
      switch (evidence_type) {
        case "GEO-LOCATION": {
          // eslint-disable-next-line max-depth
          if (!activity_evidence?.geo_location) {
            throw CustomError.create({
              httpCode: StatusCodes.BAD_REQUEST,
              message: "Acitivity Evidence is required for this Acitivity",
              property: "/activity_evidence/geo_location",
              code: "BAD_REQUEST"
            });
          }
          break;
        }
        // eslint-disable-next-line no-fallthrough
        case "IMAGE": {
          // eslint-disable-next-line max-depth
          if (!activity_evidence?.image_urls) {
            throw CustomError.create({
              httpCode: StatusCodes.BAD_REQUEST,
              message: "Acitivity Evidence is required for this Acitivity",
              property: "/activity_evidence/image_urls",
              code: "BAD_REQUEST"
            });
          }
          break;
        }
      }
    }
  });
};

const validateAndTransformInputChecklist = ({
  inputChecklist,
  checklistTemplateMap
}) => {
  return inputChecklist.map((val, index) => {
    const { question_id, option_ids, answer_text } = val;

    const matchedTemplate = checklistTemplateMap[question_id];

    if (!matchedTemplate) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Invalid Question Id Passed",
        property: `/checklist/${index}/question_id`,
        code: "BAD_REQUEST"
      });
    }

    const { question_text, optionsMap, type } = matchedTemplate;

    if (type === "TEXT") {
      if (!answer_text) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "answer_text is mandatory for question type TEXT",
          property: `/checklist/${index}/answer_text`,
          code: "BAD_REQUEST"
        });
      }

      return {
        question_id,
        question_text,
        answer_text,
        options: []
      };
    }

    const options = option_ids.map((option_id, optionIndex) => {
      const option_text = optionsMap[option_id];
      if (!option_text) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Invalid Option Passed For Question Id",
          property: `/checklist/${index}/option_ids/${optionIndex}`,
          code: "BAD_REQUEST"
        });
      }
      return {
        option_id,
        option_text
      };
    });

    return {
      question_id,
      question_text,
      answer_text,
      options
    };
  });
};

function postFetchActivitiesService(fastify) {
  const { updateActivityById, getActivityById } = activityRepo(fastify);
  const { getActivityTemplateById } = acitivityTemplateRepo(fastify);

  // eslint-disable-next-line complexity
  return async ({ params, body, logTrace }) => {
    const { activity_id } = params;
    const {
      node_id,
      user_id,

      activity_evidence,
      checklist,
      status,
      comments
    } = body;

    const acitivityResponse = await getActivityById.call(fastify.knex, {
      activity_id,
      logTrace
    });

    const { activity_evidences, checklist: checklistTemplate } =
      await getActivityTemplateById.call(fastify.knex, {
        activity_template_id: acitivityResponse.activity_template_id,
        logTrace
      });

    validateEvidence({
      activity_evidences,
      activity_evidence
    });

    const checklistTemplateMap = checklistTemplate.reduce((acc, val) => {
      const { question_id, question_text, type, options } = val;
      acc[question_id] = {
        question_text,
        type,
        optionsMap: options.reduce(
          (optionAcc, option) => ({
            ...optionAcc,
            [option.option_id]: option.option_text
          }),
          {}
        )
      };
      return acc;
    }, {});

    const finalCheckList = validateAndTransformInputChecklist({
      inputChecklist: checklist,
      checklistTemplateMap
    });

    await updateActivityById.call(fastify.knex, {
      activity_id,
      input: {
        node_id,
        completed_by: user_id,
        completed_at: momentTimezone(new Date().toISOString())
          .tz("Asia/Calcutta")
          .format("HH:mm:ss"),
        activity_evidence,
        checklist: JSON.stringify(finalCheckList),
        status,
        comments
      },
      logTrace
    });
    return { success: true };
  };
}
module.exports = postFetchActivitiesService;
