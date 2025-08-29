const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getActivityById = {
  tags: ["ACTIVITY"],
  summary: "This API is to get Activity Details by ID",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["activity_id"],
    properties: {
      activity_id: { type: "string", format: "uuid" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        activity_id: { type: "string" },
        activity_name: { type: "string" },
        activity_template_id: { type: "string" },
        node_id: { type: "string" },
        activity_date: { type: "string" },
        start_time: { type: "string" },
        end_by_time: { type: "string" },
        activity_duration_in_mins: { type: "integer" },
        completed_at: { type: "string" },
        completed_by: { type: "string" },
        // activity_evidence_type: { type: "string" },
        // is_evidence_mandatory: { type: "boolean" },
        activity_evidences: {
          $ref: "response-activity-evidences#"
        },
        submitted_activity_evidence: {
          type: "object",
          nullable: true,
          properties: {
            geo_location: {
              type: "object",
              nullable: true,
              properties: {
                latitude: { type: "string" },
                longitude: { type: "string" }
              }
            },
            image_urls: {
              type: "array",
              nullable: true,
              items: { type: "string" }
            }
          }
        },
        checklist: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question_id: {
                type: "string"
              },
              question_text: {
                type: "string"
              },
              type: {
                type: "string"
              },
              answer_text: {
                nullable: true,
                type: "string"
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    option_id: {
                      type: "string"
                    },
                    option_text: {
                      type: "string"
                    },
                    selected: { type: "boolean" }
                  }
                }
              }
            }
          }
        },
        status: { type: "string" },
        comments: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getActivityById;
