const {
  getAuthToken
} = require("@kovai-pazhamudir-nilayam/kpn-platform-token");

function downstreamCallsRepo(fastify) {
  async function getUserRoleById({ user_id, logTrace }) {
    const auth = await getAuthToken("PLATFORM");
    const response = await fastify.request({
      url: `${fastify.config.CORE_USER_SERVICE_URI}/v2/iam/users/${user_id}?channel=WEB`,
      method: "GET",
      headers: {
        ...logTrace,
        Authorization: auth,
        "x-channel-id": "WEB"
      },
      path: "/core-user/v1/iam/users/:user_id",
      downstream_system: "core-user-service",
      source_system: "core-activity-manager",
      domain: "activity-manager",
      functionality: "Get User Role By ID"
    });

    return response;
  }
  return {
    getUserRoleById
  };
}

module.exports = downstreamCallsRepo;
