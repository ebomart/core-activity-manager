const postFetchActivitiesService = require("../services/postFetchActivities");

function postFetchActivitiesHandler(fastify) {
  const postFetchActivities = postFetchActivitiesService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postFetchActivities({ body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postFetchActivitiesHandler;
