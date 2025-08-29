const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postActivityStatus = {
  tags: ["ACTIVITY"],
  summary: "This API is to Update Activity status",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      activity_id: { type: "string", format: "uuid" }
    }
  },
  body: {
    type: "object",
    required: ["node_id", "user_id", "checklist", "status"],
    properties: {
      node_id: { type: "string", minLength: 1 }, // for validation
      user_id: { type: "string", format: "uuid" },
      activity_evidence: {
        type: "object",
        minProperties: 1,
        properties: {
          geo_location: {
            type: "object",
            additionalProperties: false,
            required: ["latitude", "longitude"],
            properties: {
              latitude: { type: "string" },
              longitude: { type: "string" }
            }
          },
          image_urls: {
            type: "array",
            minItems: 1,
            items: { type: "string", format: "uri" }
          }
        }
      },
      checklist: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            question_id: { type: "string", format: "uuid" },
            answer_text: { type: "string" },
            option_ids: {
              type: "array",
              items: { type: "string", format: "uuid" }
            }
          }
        }
      },
      status: { type: "string", enum: ["COMPLETED"] },
      comments: { type: "string" }
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

module.exports = postActivityStatus;
