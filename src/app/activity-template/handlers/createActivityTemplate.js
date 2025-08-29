const createActivityTemplateService = require("../services/createActivityTemplate");

function createActivityTemplateHandler(fastify) {
  const createActivityTemplate = createActivityTemplateService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await createActivityTemplate({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = createActivityTemplateHandler;
