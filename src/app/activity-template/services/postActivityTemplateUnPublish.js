const activityRepo = require("../../activity/repository/activity");

function postActivityTemplateUnPublishService(fastify) {
  const { deleteFutureActivitiesByActivityTemplateIdAndOutletIds } =
    activityRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const { activity_template_id } = params;
    const { outlet_ids } = body;
    await deleteFutureActivitiesByActivityTemplateIdAndOutletIds.call(
      fastify.knex,
      { activity_template_id, outlet_ids, logTrace }
    );
    return { success: true };
  };
}
module.exports = postActivityTemplateUnPublishService;
