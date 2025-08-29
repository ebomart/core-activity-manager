const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const executeActivityExpiryTask = {
  tags: ["ACTIVITY"],
  summary: "This API is for executing the task to expire an acitivity",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["activity_id"],
    additionalProperties: false,
    properties: {
      activity_id: { type: "string", minLength: 1 },
      expiry_time: { type: "string", format: "time" }
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

module.exports = executeActivityExpiryTask;
