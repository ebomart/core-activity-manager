const activityRepo = require("../repository/activity");
const activityTemplateRepo = require("../../activity-template/repository/activityTemplate");

const {
  transformActivityResponse
} = require("../transformers/getActivityById");

function getActivityByIdService(fastify) {
  const { getActivityById } = activityRepo(fastify);
  const { getActivityTemplateById } = activityTemplateRepo(fastify);
  return async ({ params, logTrace }) => {
    const { activity_id } = params;

    const activityResponse = await getActivityById.call(fastify.knex, {
      activity_id,
      logTrace
    });

    const activityTemplateResponse = await getActivityTemplateById.call(
      fastify.knex,
      { activity_template_id: activityResponse.activity_template_id, logTrace }
    );

    return transformActivityResponse({
      activityResponse,
      activityTemplateResponse
    });
  };
}
module.exports = getActivityByIdService;
