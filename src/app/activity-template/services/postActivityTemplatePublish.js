const createActivitiesFromTemplateService = require("../../activity/services/createActivitiesFromTemplate");
const postActivityTemplateUnPublishService = require("./postActivityTemplateUnPublish");

function postActivityTemplatePublishService(fastify) {
  const createActivitiesFromTemplate =
    createActivitiesFromTemplateService(fastify);

  const postActivityTemplateUnPublish =
    postActivityTemplateUnPublishService(fastify);

  return async ({ body, params, logTrace }) => {
    const { activity_template_id } = params;
    const { node_ids } = body;
    await postActivityTemplateUnPublish({ body, params, logTrace });

    await createActivitiesFromTemplate({
      body: { activity_template_id, node_ids },
      logTrace
    });
    return { success: true };
  };
}
module.exports = postActivityTemplatePublishService;
