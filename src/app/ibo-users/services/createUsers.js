const userRepo = require("../repository/users");

function createUsersService(fastify) {
  const { createUser } = userRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create user service",
      logTrace
    });
    const { full_name, phone_number } = body;
    const knex = await fastify.knex;
    const response = await createUser.call(knex, {
      input: { full_name, phone_number },
      logTrace
    });
    return response; // User transformer in case transformation is needed
  };
}
module.exports = createUsersService;
