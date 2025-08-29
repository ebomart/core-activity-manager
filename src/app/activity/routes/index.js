const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/fetch",
    schema: schemas.postFetchActivities,
    handler: handlers.postFetchActivities(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/grouped/fetch",
    schema: schemas.postFetchGroupedActivities,
    handler: handlers.postFetchGroupedActivities(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/:activity_id",
    schema: schemas.getActivityById,
    handler: handlers.getActivityById(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/:activity_id/status",
    schema: schemas.postActivityStatus,
    handler: handlers.postActivityStatus(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/expiry-task-creation",
    schema: schemas.createActivityExpiryTask,
    handler: handlers.createActivityExpiryTask(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/expiry-task-execution",
    schema: schemas.executeActivityExpiryTask,
    handler: handlers.executeActivityExpiryTask(fastify)
  });
};
