const momentTimezone = require("moment-timezone");
const activityTemplateRepo = require("../repository/activityTemplate");
const activityRepo = require("../../activity/repository/activity");

function getActivityTemplateByIdService(fastify) {
  const { getActivityTemplateById } = activityTemplateRepo(fastify);
  const { getAllOuletsByActiveTemplateId } = activityRepo(fastify);
  return async ({ params, logTrace }) => {
    const { activity_template_id } = params;
    const response = await getActivityTemplateById.call(fastify.knex, {
      activity_template_id,
      logTrace
    });
    const publishedNodes = await getAllOuletsByActiveTemplateId.call(
      fastify.knex,
      {
        activity_template_id,
        logTrace
      }
    );
    const published_node_ids = publishedNodes.map(
      node => node.node_id
    );

    return {
      ...response,
      published_node_ids,
      start_from: momentTimezone(response.start_from).format("YYYY-MM-DD")
    };
  };
}
module.exports = getActivityTemplateByIdService;
