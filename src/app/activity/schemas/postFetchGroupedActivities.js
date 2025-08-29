const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postFetchGroupedActivities = {
  tags: ["ACTIVITY"],
  summary: "This API is to fetch grouped activities",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    minProperties: 1,
    required: ["user_id", "outlet_id", "activity_date"],
    properties: {
      outlet_id: { type: "string", minLength: 1 },
      activity_date: { type: "string", format: "date" },
      user_id: { type: "string", format: "uuid" },
      include_checklist_template: { type: "boolean", default: true },
      statuses: {
        type: "array",
        items: { type: "string", enum: ["PENDING", "COMPLETED", "LAPSED"] }
      },
      categories: {
        type: "array",
        items: { type: "string" }
      }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          outlet_id: { type: "string" },
          activity_date: { type: "string" },
          grouped_activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                activity_day_slot: { type: "string" },
                activities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      activity_id: { type: "string" },
                      activity_name: { type: "string" },
                      start_time: { type: "string" },
                      end_by_time: { type: "string" },
                      activity_duration_in_mins: { type: "integer" },
                      status: { type: "string" },
                      category: { type: "string" },
                      checklist_count: { type: "integer" },
                      activity_day_slot: { type: "string" }
                    }
                  }
                }
              }
            }
          },
          metadata: {
            type: "object",
            properties: {
              categories: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    completed_percentage: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = postFetchGroupedActivities;
