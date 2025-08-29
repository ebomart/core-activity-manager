const executeActivityExpiryTaskService = require("../services/executeActivityExpiryTask");

function executeActivityExpiryTaskHandler(fastify) {
  const executeActivityExpiryTask = executeActivityExpiryTaskService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await executeActivityExpiryTask({
      body,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = executeActivityExpiryTaskHandler;
