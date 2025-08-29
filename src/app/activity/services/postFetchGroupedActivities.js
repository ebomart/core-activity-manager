const activityRepo = require("../repository/activity");
const downstreamCallsRepo = require("../repository/downstreamCalls");

const {
  groupAcivitiesByNodeIdAndAcitivityDateWithActivitySlot
} = require("../transformers/postFetchGroupedActivities");

function postFetchGroupedActivitiesService(fastify) {
  const {
    getGroupedActivityListWithFilter,
    getGroupedActivityListWithFilterByUserRole
  } = activityRepo(fastify);
  const { getUserRoleById } = downstreamCallsRepo(fastify);
  return async ({ body, logTrace }) => {
    const {
      node_id,
      activity_date,
      user_id,
      statuses,
      categories,
      include_checklist_template
    } = body;

    const { user_type, roles } = await getUserRoleById({ user_id, logTrace });

    if (user_type === "ADMIN" || user_type === "SUPER_ADMIN") {
      const templateResponse = await getGroupedActivityListWithFilter.call(
        fastify.knex,
        {
          input: {
            node_id,
            activity_date,
            statuses,
            categories,
            include_checklist_template
          },
          logTrace
        }
      );

      const groupedResponseByNodeIdAndAcitivityDate =
        groupAcivitiesByNodeIdAndAcitivityDateWithActivitySlot(
          templateResponse,
          categories
        );

      return groupedResponseByNodeIdAndAcitivityDate;
    }

    const roles_names = roles.map(({ role_name }) => role_name);

    const templateResponse =
      await getGroupedActivityListWithFilterByUserRole.call(fastify.knex, {
        input: {
          node_id,
          activity_date,
          user_roles: roles_names,
          statuses,
          categories,
          include_checklist_template
        },
        logTrace
      });

    const groupedResponseByNodeIdAndAcitivityDate =
      groupAcivitiesByNodeIdAndAcitivityDateWithActivitySlot(
        templateResponse,
        categories
      );
    return groupedResponseByNodeIdAndAcitivityDate;
  };
}
module.exports = postFetchGroupedActivitiesService;
