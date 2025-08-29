// const { v5: uuidV5 } = require("uuid");

const activityTemplateRepo = require("../repository/activityTemplate");
const activityChecklistRepo = require("../repository/activityChecklist");
const activityRepo = require("../../activity/repository/activity");

const postActivityTemplatePublishService = require("./postActivityTemplatePublish");

const {
  getAuditInfo,
  getAuditInfoForUpdate
} = require("../../commons/helpers");
const {
  transformChecklist
} = require("../transformers/createActivityTemplate");
const {
  getDurationInMins,
  getStartDateTime
} = require("../helpers/createActivityTemplate");
const { getActivityDaySlot } = require("../helpers/getActivityDaySlot");

function createActivityTemplateService(fastify) {
  const { upsertActivityTemplate } = activityTemplateRepo(fastify);
  const { insertActivityChecklist, deleteChecklistByActivityTemplateId } =
    activityChecklistRepo(fastify);

  const { getDistinctNodeIdsByActivityTemplateId } = activityRepo(fastify);

  const postActivityTemplatePublish =
    postActivityTemplatePublishService(fastify);

  const createNewTemplate = async ({
    input,
    checklist,
    activity_duration_in_mins,
    escalation,
    activity_evidences,
    updatedAudit,
    start_time,
    logTrace
  }) => {
    const knexTrx = await fastify.knex.transaction();
    try {
      const { activity_template_id } = await upsertActivityTemplate.call(
        knexTrx,
        {
          input: {
            ...input,
            start_time,
            activity_day_slot: getActivityDaySlot(start_time),
            activity_evidences: JSON.stringify(activity_evidences || []),
            activity_duration_in_mins,
            audit: updatedAudit,
            escalation: JSON.stringify(escalation || [])
          },
          logTrace
        }
      );
      const transformedChecklist = transformChecklist({
        inputChecklist: checklist,
        activity_template_id
      });
      await insertActivityChecklist.call(knexTrx, {
        input: transformedChecklist,
        logTrace
      });
      await knexTrx.commit();

      return { activity_template_id };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };

  const updateExistingTemplate = async ({
    activity_template_id,
    input,
    transformedChecklist,
    activity_duration_in_mins,
    updatedAudit,
    escalation,
    activity_evidences,
    node_ids,
    start_time,
    logTrace
  }) => {
    const knexTrx = await fastify.knex.transaction();
    try {
      await deleteChecklistByActivityTemplateId.call(knexTrx, {
        activity_template_id,
        logTrace
      });

      await upsertActivityTemplate.call(knexTrx, {
        input: {
          ...input,
          start_time,
          activity_day_slot: getActivityDaySlot(start_time),
          activity_duration_in_mins,
          audit: updatedAudit,
          activity_template_id,
          activity_evidences: JSON.stringify(activity_evidences || []),
          escalation: JSON.stringify(escalation || [])
        },
        logTrace
      });
      await insertActivityChecklist.call(knexTrx, {
        input: transformedChecklist,
        logTrace
      });

      await knexTrx.commit();

      if (node_ids.length) {
        // await postActivityTemplateUnPublish({
        //   body: { node_ids },
        //   params: { activity_template_id },
        //   logTrace
        // });
        // Create cloud task to do this
        await postActivityTemplatePublish({
          body: { node_ids },
          params: { activity_template_id },
          logTrace
        });
      }

      return { activity_template_id };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };

  // eslint-disable-next-line complexity
  return async ({ body, logTrace }) => {
    const {
      activity_template_id,
      activity_name,
      audit,
      checklist,
      escalation,
      start_time,
      end_by_time,
      start_from,
      type,
      activity_evidences,
      ...restProps
    } = body;
    const activity_duration_in_mins = getDurationInMins({
      start_time,
      end_by_time
    });
    const start_datetime = getStartDateTime({ start_from });
    if (!activity_template_id) {
      const updatedAudit = getAuditInfo({ audit });
      return createNewTemplate({
        input: {
          ...restProps,
          start_from,
          type,
          activity_name,
          end_by_time,
          activity_duration_in_mins,
          start_datetime,
          audit: updatedAudit
        },
        start_time,
        checklist,
        activity_duration_in_mins,
        escalation,
        activity_evidences,
        updatedAudit,
        logTrace
      });
    }

    const transformedChecklist = transformChecklist({
      inputChecklist: checklist,
      activity_template_id
    });

    const updatedAudit = getAuditInfoForUpdate({ audit });
    const nodeIsArr = await getDistinctNodeIdsByActivityTemplateId.call(
      fastify.knex,
      {
        activity_template_id,
        logTrace
      }
    );

    const node_ids = nodeIsArr.map(val => val.node_id);

    return updateExistingTemplate({
      activity_template_id,
      input: {
        ...restProps,
        start_from,
        type,
        activity_name,
        start_time,
        end_by_time,
        activity_duration_in_mins,
        start_datetime,
        audit: updatedAudit
      },
      start_time,
      transformedChecklist,
      activity_duration_in_mins,
      updatedAudit,
      escalation,
      activity_evidences,
      node_ids,
      logTrace
    });
  };
}
module.exports = createActivityTemplateService;
