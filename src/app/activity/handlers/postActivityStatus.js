const postActivityStatusService = require("../services/postActivityStatus");

function postActivityStatusHandler(fastify) {
  const postActivityStatus = postActivityStatusService(fastify);
  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await postActivityStatus({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postActivityStatusHandler;
