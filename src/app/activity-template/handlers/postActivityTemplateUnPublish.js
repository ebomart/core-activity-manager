const postActivityTemplateUnPublishService = require("../services/postActivityTemplateUnPublish");

function postActivityTemplateUnPublishHandler(fastify) {
  const postActivityTemplateUnPublish =
    postActivityTemplateUnPublishService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await postActivityTemplateUnPublish({
      body,
      params,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = postActivityTemplateUnPublishHandler;
