const activityTemplateRepo = require("../../activity-template/repository/activityTemplate");
const activityRepo = require("../repository/activity");

const {
  getTransformedListOfAcitivitiesFromTemplate
} = require("../transformers/createActivitiesFromTemplate");

function createActivitiesFromTemplateService(fastify) {
  const { getActivityTemplateById } = activityTemplateRepo(fastify);
  const { insertActivitiesInBatches } = activityRepo(fastify);

  return async ({ body, logTrace }) => {
    const { activity_template_id, outlet_ids } = body;

    const templateResponse = await getActivityTemplateById.call(fastify.knex, {
      activity_template_id,
      logTrace
    });

    const transformedActivities = getTransformedListOfAcitivitiesFromTemplate({
      template: templateResponse,
      outlet_ids
    });

    const knexTrx = await fastify.knex.transaction();

    try {
      await insertActivitiesInBatches.call(knexTrx, {
        input: transformedActivities,
        knexReference: fastify.knex,
        logTrace
      });

      await knexTrx.commit();

      return { success: true };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = createActivitiesFromTemplateService;
