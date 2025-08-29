const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const createActivityTemplate = {
  tags: ["ACTIVITY-TEMPLATE"],
  summary: "This API is to create activity template",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "activity_name",
      "activity_role",
      "type",
      "start_time",
      "end_by_time",
      "expiry_time",
      "checklist",
      "start_from"
    ],
    additionalProperties: false,
    properties: {
      activity_template_id: { type: "string", format: "uuid" },
      activity_name: {
        type: "string",
        minLength: 2
      },
      description: {
        type: "string"
      },
      category: {
        type: "string"
      },
      priority: {
        type: "string",
        enum: ["HIGH", "MEDIUM", "LOW"]
      },
      activity_role: {
        type: "string"
      },
      type: {
        type: "string",
        enum: ["ONE_TIME", "REPEATING"]
      },
      start_from: { type: "string", format: "date" },
      repeat_info: {
        type: "object",
        additionalProperties: false,
        required: ["type", "end_by"],
        properties: {
          type: {
            type: "string",
            enum: ["DAILY", "WEEKLY", "MONTHLY"]
          },
          repeating_every: {
            // if type=Daily, then repeating_every will be every 2days, for weekly every 2 weeks, for monthly every 2 month
            type: "integer",
            default: 1
          },
          repeating_on: {
            description:
              "if type=WEEKLY, then repeating_on will be from 1-7. 1 - Sunday. \n if type=MONTHLY, then repeating_on will be from 1-31. \n NOTE: [Some months have fewer than 31 days. For these months, the occurrence will fall on the last day of the month]",
            type: "array",
            items: {
              type: "integer"
            }
          },
          end_by: {
            type: "object",
            additionalProperties: false,
            minProperties: 1,
            maxProperties: 1,
            properties: {
              // does_not_end: {
              //   type: "boolean"
              // },
              end_date: { type: "string", format: "date" },
              end_after_occurences: {
                type: "integer",
                minimum: 1
              }
            }
          }
        }
      },
      start_time: { type: "string", format: "time" }, // eg: 0100, 2130
      end_by_time: { type: "string", format: "time" }, // Expected completion prior to escalation
      expiry_time: { type: "string", format: "time" }, // After this time, the activity cannot be actioned on anymore
      activity_evidences: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["evidence_type", "is_evidence_mandatory"],
          properties: {
            evidence_type: { type: "string", enum: ["GEO-LOCATION", "IMAGE"] },
            is_evidence_mandatory: {
              type: "boolean"
            }
          }
        }
      },
      checklist: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["question_text", "type"],
          properties: {
            question_text: {
              type: "string",
              minLength: 1
            },
            type: {
              type: "string",
              enum: ["TEXT", "CHOICE", "MULTI_CHOICE"]
            },
            options: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["option_text"],
                properties: {
                  option_text: {
                    type: "string",
                    minLength: 1
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
            escalate_not_completed_by_time: { type: "string", format: "time" }
          }
        }
      },
      is_active: {
        type: "boolean"
      },
      audit: {
        $ref: "request-audit#"
      }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        activity_template_id: { type: "string", format: "uuid" }
      }
    },
    ...errorSchemas
  }
};

module.exports = createActivityTemplate;
