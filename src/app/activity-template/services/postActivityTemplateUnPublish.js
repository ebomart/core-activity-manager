const activityRepo = require("../../activity/repository/activity");

function postActivityTemplateUnPublishService(fastify) {
  const { deleteFutureActivitiesByActivityTemplateIdAndNodeIds } =
    activityRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const { activity_template_id } = params;
    const { node_ids } = body;
    await deleteFutureActivitiesByActivityTemplateIdAndNodeIds.call(
      fastify.knex,
      { activity_template_id, node_ids, logTrace }
    );
    return { success: true };
  };
}
module.exports = postActivityTemplateUnPublishService;
