const activityTemplateRepo = require("../repository/activityTemplate");

function getActivityTemplateListService(fastify) {
  const { getActivityTemplateListWithPagination } =
    activityTemplateRepo(fastify);

  return async ({ query, logTrace }) => {
    const { current_page, page_size } = query;
    const response = await getActivityTemplateListWithPagination.call(
      fastify.knex,
      {
        input: { current_page, page_size },
        logTrace
      }
    );
    return response;
  };
}
module.exports = getActivityTemplateListService;
