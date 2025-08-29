const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getActivityTemplateById = {
  tags: ["ACTIVITY-TEMPLATE"],
  summary: "This API is to get activity template by ID",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      activity_template_id: { type: "string", format: "uuid" }
    }
  },
  response: {
    200: {
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
        priority: {
          type: "string"
        },
        activity_role: {
          type: "string"
        },
        type: {
          type: "string"
        },
        start_from: { type: "string" },
        start_datetime: { type: "string" },
        repeat_info: {
          type: "object",
          nullable: true,
          properties: {
            start_datetime: { type: "string" },
            type: {
              type: "string"
            },
            repeating_every: {
              type: "integer"
            },
            repeating_on: {
              type: "array",
              items: {
                type: "integer"
              }
            },
            end_by: {
              type: "object",
              properties: {
                // does_not_end: {
                //   type: "boolean"
                // },
                end_date: { type: "string" },
                end_after_occurences: {
                  type: "integer"
                }
              }
            }
          }
        },
        start_time: { type: "string" },
        end_by_time: { type: "string" },
        expiry_time: { type: "string" },
        activity_duration_in_mins: {
          type: "integer"
        },
        activity_evidences: {
          $ref: "response-activity-evidences#"
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
                    }
                  }
                }
              }
            }
          }
        },
        escalation: {
          type: "array",
          items: {
            type: "object",
            properties: {
              escalation_level: {
                type: "integer"
              },
              escalation_role: {
                type: "string"
              },
              escalate_not_completed_by_time: { type: "string" }
            }
          }
        },
        published_outlet_ids: {
          type: "array",
          items: { type: "string" }
        },
        is_active: {
          type: "boolean"
        },
        audit: {
          $ref: "response-audit#"
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getActivityTemplateById;
