require("dotenv").config();
const fastifyEnv = require("@fastify/env");
const fastifyHealthcheck = require("fastify-healthcheck");
const envSchema = require("env-schema");
const swagger = require("@fastify/swagger");
const fastifyMetrics = require("fastify-metrics");

const { envSchema: schema } = require("./app/commons/schemas/envSchemas");
const { knexConfig } = require("../config/index");
const routes = require("./app/ibo-users/routes");

// PLUGINS
const ajv = require("./app/plugins/ajv");
const memCache = require("./app/plugins/mem-cache");
const knex = require("./app/plugins/knex");
const readGcpSecret = require("./app/plugins/readGcpSecret");
const httpClient = require("./app/plugins/httpClient");
const pubsub = require("./app/plugins/pubsub");
const cloudBucket = require("./app/plugins/cloudBucket");

const {
  extractLogTrace,
  requestLogging,
  responseLogging
} = require("./app/hooks/logging");

const { SWAGGER_CONFIGS, SERVER_CONFIGS } = require("./app/commons/configs");
const { METRICS_CONFIGS } = require("./app/commons/metrics.config");

const { errorHandler } = require("./app/errorHandler");

function create() {
  // eslint-disable-next-line global-require
  const fastify = require("fastify")(SERVER_CONFIGS);

  fastify.setErrorHandler(errorHandler());
  fastify.register(fastifyHealthcheck);

  // Env vars plugin
  fastify.register(fastifyEnv, {
    dotenv: true,
    schema
  });

  // HOOKS
  fastify.addHook("onRequest", extractLogTrace);
  fastify.addHook("preValidation", requestLogging);
  fastify.addHook("onSend", responseLogging);

  // PLUGINS
  fastify.register(ajv);
  fastify.register(httpClient);
  fastify.register(knex, knexConfig);
  fastify.register(memCache);
  fastify.register(readGcpSecret);
  fastify.register(swagger, SWAGGER_CONFIGS);
  fastify.register(pubsub);
  fastify.register(cloudBucket);

  // ROUTES
  fastify.register(routes, { prefix: "/v1" });

  // Fastify-metrics
  if (process.env.NODE_ENV !== "test") {
    fastify.register(fastifyMetrics, METRICS_CONFIGS);
  }

  return fastify;
}

async function start() {
  const fastify = create();
  const defaultSchema = {
    type: "object",
    properties: {
      HOST: {
        type: "string",
        default: "0.0.0.0"
      },
      PORT: {
        type: "integer",
        default: 4444
      }
    }
  };
  const config = envSchema({ schema: defaultSchema, dotenv: true });
  // Run the server!
  fastify.listen(config.PORT, config.HOST, (err, address) => {
    /* istanbul ignore next */
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log(`server listening on ${address}`);
  });
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  start();
}

module.exports = {
  create,
  start
};
