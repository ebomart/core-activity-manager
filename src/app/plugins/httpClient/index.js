const fp = require("fastify-plugin");
const httpClient = require("./axios");
const graphQlClient = require("./urql");
const Metrics = require("./metrics");
const { CustomError } = require("../../errorHandler");

function getTraceHeadersFromHeaders(headers) {
  const headerKeys = [
    "x-request-id",
    "x-b3-traceid",
    "x-b3-spanid",
    "x-b3-parentspanid",
    "x-b3-sampled",
    "x-ot-span-context",
    "x-b3-flags"
  ];

  return headerKeys.reduce(
    (logTrace, header) =>
      Object.assign(
        logTrace,
        headers[header] && {
          [header]: headers[header]
        }
      ),
    {}
  );
}

const httpClientWrapper =
  fastify =>
  // eslint-disable-next-line complexity
  async ({
    url,
    path,
    method,
    body,
    headers = {},
    timeout,
    downstream_system,
    source_system,
    domain,
    functionality,
    response_type,
    exclude_response_data_logging = false
  }) => {
    const common = {
      request: {
        url,
        method,
        data: body,
        path
      },
      log_trace: getTraceHeadersFromHeaders(headers),
      downstream_system,
      source_system,
      message: "REST Request Context:",
      domain,
      functionality
    };

    fastify.log.info(common);

    const mInstance = Metrics.init({
      status_code: 200,
      method,
      route: path
    });

    try {
      const response = await httpClient({
        url,
        method,
        headers,
        body,
        timeout,
        response_type
      });
      mInstance.updateStatus(response.status).consume();
      fastify.log.info({
        ...common,
        response: {
          ...(!exclude_response_data_logging && { data: response.data }),
          response_time: mInstance.getResponseTime(),
          status_code: response.status
        },
        message: "REST Response Context:"
      });
      return response.data;
    } catch (error) {
      mInstance.updateStatus(error?.response?.status || 500).consume();
      fastify.log.error({
        ...common,
        response: {
          error: error?.response?.data,
          response_time: mInstance.getResponseTime(),
          status_code: error?.response?.status || 500,
          raw_error: error
        },
        message: "REST Response Context:"
      });
      if (error?.response?.status) {
        throw CustomError.createHttpError({
          httpCode: error.response.status,
          errorResponse: error.response.data,
          downstream_system
        });
      }
      throw error;
    }
  };

// eslint-disable-next-line complexity
const graphQlClientWrapper = fastify => {
  // eslint-disable-next-line complexity
  return async ({
    url,
    headers,
    method = "POST",
    mutation,
    query,
    path,
    source_system,
    domain,
    functionality,
    downstream_system
  }) => {
    const template = mutation || query;
    const templateKey = mutation ? "mutation" : "query";
    const common = {
      request: {
        url,
        method,
        path,
        data: {
          [templateKey]: template.template.loc.source.body,
          bindings: template.binding
        },
        headers
      },
      log_trace: getTraceHeadersFromHeaders(headers),
      downstream_system: downstream_system || "Magento",
      source_system,
      domain,
      functionality
    };

    fastify.log.info({ ...common, message: "GraphQL Request Context:" });

    const mInstance = Metrics.init({
      status_code: 200,
      method,
      route: path
    });

    try {
      const { data, error } = await graphQlClient({
        url,
        headers,
        mutation,
        query
      });
      if (!error) {
        mInstance.updateStatus(200).consume();
        fastify.log.info({
          ...common,
          response: {
            data,
            response_time: mInstance.getResponseTime(),
            status_code: 200
          },
          message: `GraphQL Response Context:`
        });
        return data;
      }
      const { status_code, errors } =
        CustomError.getStatusCodeAndErrorFromMagentoError(error);
      mInstance.updateStatus(status_code).consume();
      fastify.log.error({
        ...common,
        response: {
          error: errors,
          raw_error: error,
          response_time: mInstance.getResponseTime(),
          status_code
        },
        message: `GraphQL Response Context:`
      });
      throw new CustomError(status_code, errors);
    } catch (error) {
      mInstance.updateStatus(error?.response?.status || 500).consume();
      if (!(error instanceof CustomError)) {
        fastify.log.error({
          ...common,
          response: {
            error: error?.response?.data,
            response_time: mInstance.getResponseTime(),
            status_code: error?.response?.status || 500,
            raw_error: error
          },
          message: "GraphQL Response Context:"
        });
      }

      if (error?.response?.status) {
        throw CustomError.createHttpError({
          httpCode: error.response.status,
          errorResponse: error.response.data,
          downstream_system
        });
      }
      throw error;
    }
  };
};

const httpClientPlugin = async fastify => {
  fastify.decorate("request", httpClientWrapper(fastify));
  fastify.decorate("graphQl", graphQlClientWrapper(fastify));
};
module.exports = fp(httpClientPlugin);
