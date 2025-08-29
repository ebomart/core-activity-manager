const schemas = require("../schemas");
const handlers = require("../handlers");
const preHandlers = require("../preHandlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: schemas.createActivityTemplate,
    preHandler:
      preHandlers.createActivityTemplate.validateActivityTemplateRepeatInfo,
    handler: handlers.createActivityTemplate(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/:activity_template_id",
    schema: schemas.getActivityTemplateById,
    handler: handlers.getActivityTemplateById(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/",
    schema: schemas.getActivityTemplateList,
    handler: handlers.getActivityTemplateList(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/:activity_template_id/publish",
    schema: schemas.postActivityTemplatePublish,
    handler: handlers.postActivityTemplatePublish(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/:activity_template_id/unpublish",
    schema: schemas.postActivityTemplateUnPublish,
    handler: handlers.postActivityTemplateUnPublish(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/category-role-list",
    schema: schemas.getCategoryRoleList,
    handler: handlers.getCategoryRoleList(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/fetch",
    schema: schemas.postFetchActivityTemplateList,
    handler: handlers.postFetchActivityTemplateList(fastify)
  });
};
