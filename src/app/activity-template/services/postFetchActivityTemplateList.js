const activityTemplateRepo = require("../repository/activityTemplate");

function postFetchActivityTemplateListService(fastify) {
  const { getActivityTemplateListWithPagination } =
    activityTemplateRepo(fastify);

  return async ({ query, body, logTrace }) => {
    const { current_page, page_size } = query;
    const { filters } = body;
    const response = await getActivityTemplateListWithPagination.call(
      fastify.knex,
      {
        input: { current_page, page_size, filters },
        logTrace
      }
    );
    return response;
  };
}
module.exports = postFetchActivityTemplateListService;
