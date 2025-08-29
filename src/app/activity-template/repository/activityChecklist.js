// const { StatusCodes } = require("http-status-codes");
// const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { ACTIVITY_TEMPLATE_CHECKLIST } = require("../commons/model");

function activityChecklistRepo(fastify) {
  async function insertActivityChecklist({ input, logTrace }) {
    const knex = this;
    const query = knex(ACTIVITY_TEMPLATE_CHECKLIST.NAME).insert(input);
    logQuery({
      logger: fastify.log,
      query,
      context: "Insert Activity Template",
      logTrace
    });
    return query;
  }

  async function getChecklistByActivityTemplateId({
    activity_template_id,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY_TEMPLATE_CHECKLIST.NAME).where(
      ACTIVITY_TEMPLATE_CHECKLIST.COLUMNS.ACTIVITY_TEMPLATE_ID,
      activity_template_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activity Checklist By Activity Template ID",
      logTrace
    });
    return query;
  }

  async function deleteChecklistByActivityTemplateId({
    activity_template_id,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY_TEMPLATE_CHECKLIST.NAME)
      .del()
      .where(
        ACTIVITY_TEMPLATE_CHECKLIST.COLUMNS.ACTIVITY_TEMPLATE_ID,
        activity_template_id
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Delete Activity Checklist By Activity Template ID",
      logTrace
    });
    return query;
  }

  return {
    insertActivityChecklist,
    getChecklistByActivityTemplateId,
    deleteChecklistByActivityTemplateId
  };
}

module.exports = activityChecklistRepo;
