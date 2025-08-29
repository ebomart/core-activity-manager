const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const createActivityExpiryTask = {
  tags: ["ACTIVITY"],
  summary:
    "This API is to Create Cloud Task for the Acitivities that is about to expire",
  headers: { $ref: "request-headers#" },
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

module.exports = createActivityExpiryTask;
