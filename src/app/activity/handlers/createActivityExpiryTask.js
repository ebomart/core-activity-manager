const createActivityExpiryTaskService = require("../services/createActivityExpiryTask");

function createActivityExpiryTaskHandler(fastify) {
  const createActivityExpiryTask = createActivityExpiryTaskService(fastify);
  return async (request, reply) => {
    const { logTrace } = request;
    const response = await createActivityExpiryTask({ logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = createActivityExpiryTaskHandler;
