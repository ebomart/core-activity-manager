const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { ACTIVITY } = require("../commons/model");
const {
  ACTIVITY_TEMPALTE,
  ACTIVITY_TEMPLATE_CHECKLIST
} = require("../../activity-template/commons/model");

function activityRepo(fastify) {
  async function insertActivities({ input, logTrace }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME).insert(input);
    logQuery({
      logger: fastify.log,
      query,
      context: "Insert Activities",
      logTrace
    });
    return query;
  }

  async function insertActivitiesInBatches({ input, knexReference }) {
    const knexTrx = this;
    const queryResult = await knexReference
      .batchInsert(ACTIVITY.NAME, input, 500)
      .transacting(knexTrx);
    return queryResult;
  }

  async function updateActivityById({ activity_id, input, logTrace }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME)
      .update(input)
      .where(ACTIVITY.COLUMNS.ACTIVITY_ID, activity_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Update Activity By Id",
      logTrace
    });
    return query;
  }

  async function getActivityById({ activity_id, logTrace }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME).where(
      ACTIVITY.COLUMNS.ACTIVITY_ID,
      activity_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activity By ID",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No Activity Found For Given Id",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getActivitiesByActivityTemplateId({
    activity_template_id,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME).where(
      ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID,
      activity_template_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activities By Activity Template ID",
      logTrace
    });
    return query;
  }

  async function getDistinctNodeIdsByActivityTemplateId({
    activity_template_id,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME)
      .distinct(ACTIVITY.COLUMNS.NODE_ID)
      .where(ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID, activity_template_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Node Ids By Activity Template ID",
      logTrace
    });
    return query;
  }

  async function deleteFutureActivitiesByActivityTemplateIdAndNodeIds({
    activity_template_id,
    node_ids,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME)
      .del()
      .where(ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID, activity_template_id)
      // .whereRaw(
      //   `(${ACTIVITY.COLUMNS.ACTIVITY_START_DATETIME} > CURRENT_TIMESTAMP OR to_char(${ACTIVITY.COLUMNS.ACTIVITY_START_DATETIME}, 'YYYY-MM-DD') = to_char(CURRENT_TIMESTAMP,'YYYY-MM-DD') OR to_char(${ACTIVITY.COLUMNS.ACTIVITY_DATE}, 'YYYY-MM-DD') = (TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD')))`
      // )
      .whereRaw(
        `(${ACTIVITY.COLUMNS.ACTIVITY_START_DATETIME} > CURRENT_TIMESTAMP  OR to_char(${ACTIVITY.COLUMNS.ACTIVITY_DATE}, 'YYYY-MM-DD') = (TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD')))`
      )
      .whereIn(ACTIVITY.COLUMNS.NODE_ID, node_ids);
    logQuery({
      logger: fastify.log,
      query,
      context: "Delete Future Activities By Activity Template ID",
      logTrace
    });
    return query;
  }

  // eslint-disable-next-line complexity
  async function getActivityListWithFilter({ input, logTrace }) {
    const knex = this;
    const {
      node_id,
      activity_date_from,
      activity_date_to,
      statuses,
      categories,
      include_checklist_template
    } = input;
    const columns = [
      "ACTV.*",
      ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_DAY_SLOT,
      ACTIVITY_TEMPALTE.COLUMNS.CATEGORY
    ];

    const subQueryToGetChecklist = `(SELECT coalesce(json_agg(CHKLST.*), '[]'::json) FROM ${ACTIVITY_TEMPLATE_CHECKLIST.NAME} AS CHKLST WHERE CHKLST.activity_template_id= "ACTV".activity_template_id ) as checklist_template`;
    if (include_checklist_template) {
      columns.push(knex.raw(subQueryToGetChecklist));
    }
    const queryForGettingActivityTemplateIdsBycategories = knex
      .select(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID)
      .from(ACTIVITY_TEMPALTE.NAME)
      .whereIn(ACTIVITY_TEMPALTE.COLUMNS.CATEGORY, categories);

    let query = knex
      .select(columns)
      .from(`${ACTIVITY.NAME} as ACTV`)
      .leftJoin(
        `${ACTIVITY_TEMPALTE.NAME} as ACT`,
        `ACT.${ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`
      );
    if (node_id) {
      query = query.where(`ACTV.${ACTIVITY.COLUMNS.NODE_ID}`, node_id);
    }

    if (statuses) {
      query = query.whereIn(`ACTV.${ACTIVITY.COLUMNS.STATUS}`, statuses);
    }

    if (activity_date_from) {
      query = query.where(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_DATE}`,
        ">=",
        activity_date_from
      );
    }

    if (activity_date_to) {
      query = query.where(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_DATE}`,
        "<=",
        activity_date_to
      );
    }
    if (categories?.length > 0 && !categories?.includes("ALL")) {
      query = query.whereIn(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        queryForGettingActivityTemplateIdsBycategories
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activities With Filter",
      logTrace
    });
    return query.orderBy(ACTIVITY.COLUMNS.ACTIVITY_START_DATETIME);
  }

  // eslint-disable-next-line complexity
  async function getActivityListWithFilterByUserRole({ input, logTrace }) {
    const knex = this;
    const {
      node_id,
      activity_date_from,
      activity_date_to,
      user_roles,
      statuses,
      categories,
      include_checklist_template
    } = input;

    const queryForGettingActivityTemplateIdsByRole = knex
      .select(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID)
      .from(ACTIVITY_TEMPALTE.NAME)
      .whereIn(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_ROLE, user_roles);

    const columns = [
      "ACTV.*",
      ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_DAY_SLOT,
      ACTIVITY_TEMPALTE.COLUMNS.CATEGORY
    ];

    if (categories?.length > 0 && !categories?.includes("ALL")) {
      queryForGettingActivityTemplateIdsByRole.whereIn(
        ACTIVITY_TEMPALTE.COLUMNS.CATEGORY,
        categories
      );
    }
    const subQueryToGetChecklist = `(SELECT coalesce(json_agg(CHKLST.*), '[]'::json) FROM ${ACTIVITY_TEMPLATE_CHECKLIST.NAME} AS CHKLST WHERE CHKLST.activity_template_id= "ACTV".activity_template_id ) as checklist_template`;
    if (include_checklist_template) {
      columns.push(knex.raw(subQueryToGetChecklist));
    }

    let query = knex
      .select(columns)
      .from(`${ACTIVITY.NAME} as ACTV`)
      .leftJoin(
        `${ACTIVITY_TEMPALTE.NAME} as ACT`,
        `ACT.${ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`
      )
      .whereIn(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        queryForGettingActivityTemplateIdsByRole
      );

    if (node_id) {
      query = query.where(`ACTV.${ACTIVITY.COLUMNS.NODE_ID}`, node_id);
    }

    if (statuses) {
      query = query.whereIn(`ACTV.${ACTIVITY.COLUMNS.STATUS}`, statuses);
    }

    if (activity_date_from) {
      query = query.where(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_DATE}`,
        ">=",
        activity_date_from
      );
    }

    if (activity_date_to) {
      query = query.where(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_DATE}`,
        "<=",
        activity_date_to
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activities By User Role With Filter",
      logTrace
    });
    return query;
  }

  // eslint-disable-next-line complexity
  async function getPendingActivityListAboutToExpire({
    input: { inputDate, inputTime },
    logTrace
  }) {
    const knex = this;

    const query = knex
      .select([ACTIVITY.COLUMNS.ACTIVITY_ID, ACTIVITY.COLUMNS.EXPIRY_TIME])
      .from(ACTIVITY.NAME)
      .where(ACTIVITY.COLUMNS.ACTIVITY_DATE, inputDate)
      .where(ACTIVITY.COLUMNS.END_BY_TIME, "<=", inputTime)
      .where(ACTIVITY.COLUMNS.EXPIRY_TIME, ">=", inputTime)
      .where(ACTIVITY.COLUMNS.STATUS, "PENDING");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Pending Activities about to expire",
      logTrace
    });
    return query;
  }

  async function updateActivityAsExpiredIfNotCompleted({
    activity_id,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME)
      .update(ACTIVITY.COLUMNS.STATUS, "LAPSED")
      .where(ACTIVITY.COLUMNS.ACTIVITY_ID, activity_id)
      .where(ACTIVITY.COLUMNS.STATUS, "PENDING");
    logQuery({
      logger: fastify.log,
      query,
      context: "Update Activity as Expired By Id",
      logTrace
    });
    return query;
  }

  async function getAllOuletsByActiveTemplateId({
    activity_template_id,
    logTrace
  }) {
    const knex = this;
    const query = knex(ACTIVITY.NAME)
      .distinct(ACTIVITY.COLUMNS.NODE_ID)
      .where(ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID, activity_template_id)
      .where(
        ACTIVITY.COLUMNS.ACTIVITY_START_DATETIME,
        ">",
        knex.raw("current_timestamp")
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Node Ids By Activity Template ID",
      logTrace
    });
    return query;
  }

  async function getGroupedActivityListWithFilter({ input, logTrace }) {
    const knex = this;
    const {
      node_id,
      activity_date,
      statuses,
      // categories,
      include_checklist_template
    } = input;
    const columns = [
      "ACTV.*",
      ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_DAY_SLOT,
      ACTIVITY_TEMPALTE.COLUMNS.CATEGORY
    ];
    const subQueryToGetChecklist = `(SELECT coalesce(json_agg(CHKLST.*), '[]'::json) FROM ${ACTIVITY_TEMPLATE_CHECKLIST.NAME} AS CHKLST WHERE CHKLST.activity_template_id= "ACTV".activity_template_id ) as checklist_template`;
    if (include_checklist_template) {
      columns.push(knex.raw(subQueryToGetChecklist));
    }

    // const queryForGettingActivityTemplateIdsBycategories = knex
    //   .select(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID)
    //   .from(ACTIVITY_TEMPALTE.NAME)
    //   .whereIn(ACTIVITY_TEMPALTE.COLUMNS.CATEGORY, categories);

    let query = knex
      .select(columns)
      .from(`${ACTIVITY.NAME} as ACTV`)
      .leftJoin(
        `${ACTIVITY_TEMPALTE.NAME} as ACT`,
        `ACT.${ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`
      )
      .where(`ACTV.${ACTIVITY.COLUMNS.NODE_ID}`, node_id)
      .where(`ACTV.${ACTIVITY.COLUMNS.ACTIVITY_DATE}`, "=", activity_date);

    if (statuses) {
      query = query.whereIn(`ACTV.${ACTIVITY.COLUMNS.STATUS}`, statuses);
    }

    // if (categories?.length > 0 && !categories?.includes("ALL")) {
    //   query = query.whereIn(
    //     `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
    //     queryForGettingActivityTemplateIdsBycategories
    //   );
    // }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get grouped Activities With Filter",
      logTrace
    });
    return query.orderBy(ACTIVITY.COLUMNS.ACTIVITY_START_DATETIME);
  }
  async function getGroupedActivityListWithFilterByUserRole({
    input,
    logTrace
  }) {
    const knex = this;
    const {
      node_id,
      activity_date,
      user_roles,
      statuses,
      // categories,
      include_checklist_template
    } = input;

    const queryForGettingActivityTemplateIdsByRole = knex
      .select(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID)
      .from(ACTIVITY_TEMPALTE.NAME)
      .whereIn(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_ROLE, user_roles);

    const columns = [
      "ACTV.*",
      ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_DAY_SLOT,
      ACTIVITY_TEMPALTE.COLUMNS.CATEGORY
    ];

    // if (categories?.length > 0 && !categories?.includes("ALL")) {
    //   queryForGettingActivityTemplateIdsByRole.whereIn(
    //     ACTIVITY_TEMPALTE.COLUMNS.CATEGORY,
    //     categories
    //   );
    // }
    const subQueryToGetChecklist = `(SELECT coalesce(json_agg(CHKLST.*), '[]'::json) FROM ${ACTIVITY_TEMPLATE_CHECKLIST.NAME} AS CHKLST WHERE CHKLST.activity_template_id= "ACTV".activity_template_id ) as checklist_template`;
    if (include_checklist_template) {
      columns.push(knex.raw(subQueryToGetChecklist));
    }

    let query = knex
      .select(columns)
      .from(`${ACTIVITY.NAME} as ACTV`)
      .leftJoin(
        `${ACTIVITY_TEMPALTE.NAME} as ACT`,
        `ACT.${ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`
      )
      .whereIn(
        `ACTV.${ACTIVITY.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        queryForGettingActivityTemplateIdsByRole
      )
      .where(`ACTV.${ACTIVITY.COLUMNS.NODE_ID}`, node_id)
      .where(`ACTV.${ACTIVITY.COLUMNS.ACTIVITY_DATE}`, "=", activity_date);
    if (statuses) {
      query = query.whereIn(`ACTV.${ACTIVITY.COLUMNS.STATUS}`, statuses);
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get grouped Activities By User Role With Filter",
      logTrace
    });
    return query;
  }

  return {
    insertActivities,
    getActivitiesByActivityTemplateId,
    deleteFutureActivitiesByActivityTemplateIdAndNodeIds,
    getActivityListWithFilter,
    updateActivityById,
    getActivityById,
    getActivityListWithFilterByUserRole,
    getPendingActivityListAboutToExpire,
    updateActivityAsExpiredIfNotCompleted,
    getDistinctNodeIdsByActivityTemplateId,
    insertActivitiesInBatches,
    getAllOuletsByActiveTemplateId,
    getGroupedActivityListWithFilter,
    getGroupedActivityListWithFilterByUserRole
  };
}

module.exports = activityRepo;
