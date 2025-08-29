const getActivityTemplateListService = require("../services/getActivityTemplateList");

function getActivityTemplateListHandler(fastify) {
  const getActivityTemplateList = getActivityTemplateListService(fastify);
  return async (request, reply) => {
    const { query, logTrace } = request;
    const response = await getActivityTemplateList({ query, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getActivityTemplateListHandler;
