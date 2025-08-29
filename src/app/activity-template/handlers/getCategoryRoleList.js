const getCategoryRoleListService = require("../services/getCategoryRoleList");

function getCategoryRoleListHandler(fastify) {
  const getCategoryRoleList = getCategoryRoleListService(fastify);
  return async (request, reply) => {
    const { query, logTrace } = request;
    const response = await getCategoryRoleList({ query, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCategoryRoleListHandler;
