const activityTemplateRepo = require("../repository/activityTemplate");

function getCategoryRoleListService(fastify) {
  const { getUniqueRoles, getUniqueCategories } = activityTemplateRepo(fastify);

  return async ({ logTrace }) => {
    const [categories, roles] = await Promise.all([
      getUniqueCategories.call(fastify.knex, { logTrace }),
      getUniqueRoles.call(fastify.knex, { logTrace })
    ]);

    return {
      categories,
      roles
    };
  };
}
module.exports = getCategoryRoleListService;
