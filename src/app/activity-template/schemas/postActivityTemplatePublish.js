const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postActivityTemplatePublish = {
  tags: ["ACTIVITY-TEMPLATE"],
  summary: "This API is to publish activity template to nodes",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["activity_template_id"],
    properties: {
      activity_template_id: { type: "string", format: "uuid" }
    }
  },
  body: {
    type: "object",
    required: ["node_ids"],
    additionalProperties: false,
    properties: {
      node_ids: {
        type: "array",
        minItems: 1,
        items: {
          type: "string",
          minLength: 1
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postActivityTemplatePublish;
