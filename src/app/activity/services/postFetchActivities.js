const activityRepo = require("../repository/activity");
const downstreamCallsRepo = require("../repository/downstreamCalls");

const {
  groupAcivitiesByOutletIdAndAcitivityDate
} = require("../transformers/postFetchActivities");

function postFetchActivitiesService(fastify) {
  const { getActivityListWithFilter, getActivityListWithFilterByUserRole } =
    activityRepo(fastify);
  const { getUserRoleById } = downstreamCallsRepo(fastify);
  return async ({ body, logTrace }) => {
    const {
      outlet_id,
      activity_date_from,
      activity_date_to,
      user_id,
      statuses,
      categories,
      include_checklist_template
    } = body;

    const { user_type, roles } = await getUserRoleById({ user_id, logTrace });

    if (user_type === "ADMIN" || user_type === "SUPER_ADMIN") {
      const templateResponse = await getActivityListWithFilter.call(
        fastify.knex,
        {
          input: {
            outlet_id,
            activity_date_from,
            activity_date_to,
            statuses,
            include_checklist_template,
            categories
          },
          logTrace
        }
      );

      const groupedResponseByOutletIdAndAcitivityDate =
        groupAcivitiesByOutletIdAndAcitivityDate(templateResponse);
      return groupedResponseByOutletIdAndAcitivityDate;
    }

    const roles_names = roles.map(({ role_name }) => role_name);

    const templateResponse = await getActivityListWithFilterByUserRole.call(
      fastify.knex,
      {
        input: {
          outlet_id,
          activity_date_from,
          activity_date_to,
          user_roles: roles_names,
          statuses,
          categories,
          include_checklist_template
        },
        logTrace
      }
    );

    const groupedResponseByOutletIdAndAcitivityDate =
      groupAcivitiesByOutletIdAndAcitivityDate(templateResponse);
    return groupedResponseByOutletIdAndAcitivityDate;
  };
}
module.exports = postFetchActivitiesService;
