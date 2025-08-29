const postFetchActivityTemplateListService = require("../services/postFetchActivityTemplateList");

function postFetchActivityTemplateListHandler(fastify) {
  const postFetchActivityTemplateList =
    postFetchActivityTemplateListService(fastify);
  return async (request, reply) => {
    const { query, body, logTrace } = request;
    const response = await postFetchActivityTemplateList({
      query,
      body,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = postFetchActivityTemplateListHandler;
