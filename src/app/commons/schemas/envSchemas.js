exports.envSchema = {
  type: "object",
  properties: {
    DB_USER: {
      type: "string",
      default: "postgres"
    },
    DB_PASSWORD: {
      type: "string",
      default: "postgres"
    },
    DB_NAME: {
      type: "string",
      default: "postgres"
    },
    DB_HOST: {
      type: "string",
      default: "localhost"
    },
    DB_PORT: {
      type: "string",
      default: "5432"
    },
    CORE_USER_SERVICE_URI: {
      type: "string"
    },
    ACTIVITY_MANAGER_QUEUE: {
      type: "string",
      default: "activity-manager-queue"
    },
    GCP_ZONE: { type: "string", default: "asia-south1" },
    GCP_PROJECT_ID: {
      type: "string",
      default: "kpn-staging-380605"
    },
    SERVICE_BASE_URL: { type: "string" }
  }
};
