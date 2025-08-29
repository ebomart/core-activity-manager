const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getCategoryRoleList = {
  tags: ["ACTIVITY-TEMPLATE"],
  summary: "This API is to get categories and roles from activity templates",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "string"
          }
        },
        roles: {
          type: "array",
          items: {
            type: "string"
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getCategoryRoleList;
