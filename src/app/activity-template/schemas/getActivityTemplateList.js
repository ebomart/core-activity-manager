const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getActivityTemplateList = {
  tags: ["ACTIVITY-TEMPLATE"],
  summary: "This API is to get activity template list",
  headers: { $ref: "request-headers#" },
  query: {
    type: "object",
    properties: {
      current_page: { type: "integer", default: 1 },
      page_size: { type: "integer", default: 10 }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity_template_id: { type: "string" },
              activity_name: {
                type: "string"
              },
              description: {
                type: "string"
              },
              category: {
                type: "string"
              },
              is_active: {
                type: "boolean"
              },
              activity_role: {
                type: "string"
              },
              start_time: {
                type: "string"
              },
              end_by_time: {
                type: "string"
              },
              audit: {
                $ref: "response-audit#"
              }
            }
          }
        },
        meta: {
          type: "object",
          properties: {
            pagination: { $ref: "response-pagination#" }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getActivityTemplateList;
