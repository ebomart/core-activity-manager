const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postFetchActivities = {
  tags: ["ACTIVITY"],
  summary: "This API is to fetch activities",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    minProperties: 1,
    required: ["user_id"],
    properties: {
      node_id: { type: "string", minLength: 1 },
      activity_date_from: { type: "string", format: "date" },
      activity_date_to: { type: "string", format: "date" },
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
          node_id: { type: "string" },
          activity_date: { type: "string" },
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
                categories: { type: "string" },
                checklist_count: { type: "integer" },
                activity_day_slot: { type: "string" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = postFetchActivities;
