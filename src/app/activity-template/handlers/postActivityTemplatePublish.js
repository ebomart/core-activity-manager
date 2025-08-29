const postActivityTemplatePublishService = require("../services/postActivityTemplatePublish");

function postActivityTemplatePublishHandler(fastify) {
  const postActivityTemplatePublish =
    postActivityTemplatePublishService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await postActivityTemplatePublish({
      body,
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = postActivityTemplatePublishHandler;
