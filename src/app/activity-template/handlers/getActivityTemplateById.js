const getActivityTemplateByIdService = require("../services/getActivityTemplateById");

function getActivityTemplateByIdHandler(fastify) {
  const getActivityTemplateById = getActivityTemplateByIdService(fastify);
  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getActivityTemplateById({ params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getActivityTemplateByIdHandler;
