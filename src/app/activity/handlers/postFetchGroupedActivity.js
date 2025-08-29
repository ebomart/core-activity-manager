const postFetchGroupedActivitiesService = require("../services/postFetchGroupedActivities");

function postFetchGroupedActivitiesHandler(fastify) {
  const postFetchGroupedActivities = postFetchGroupedActivitiesService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postFetchGroupedActivities({ body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postFetchGroupedActivitiesHandler;
