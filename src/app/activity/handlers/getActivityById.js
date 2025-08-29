const getActivityByIdService = require("../services/getActivityById");

function getActivityByIdHandler(fastify) {
  const getActivityById = getActivityByIdService(fastify);
  return async (request, reply) => {
    const { params, logTrace } = request;
    const response = await getActivityById({ params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getActivityByIdHandler;
