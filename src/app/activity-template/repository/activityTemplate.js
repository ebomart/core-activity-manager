const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const {
  ACTIVITY_TEMPALTE,
  ACTIVITY_TEMPLATE_CHECKLIST
} = require("../commons/model");

function activityTemplateRepo(fastify) {
  async function upsertActivityTemplate({ input, logTrace }) {
    const knex = this;
    const query = knex(ACTIVITY_TEMPALTE.NAME)
      .insert(input)
      .returning(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID)
      .onConflict([ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID])
      .merge();
    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert Activity Template",
      logTrace
    });
    const response = await query;
    return response[0];
  }

  async function getActivityTemplateById({ activity_template_id, logTrace }) {
    const knex = this;
    const subQuery = `(SELECT coalesce(json_agg(AC.*), '[]'::json) FROM ${ACTIVITY_TEMPLATE_CHECKLIST.NAME} AS AC WHERE AC.activity_template_id= "AT".activity_template_id ) as checklist`;
    const query = knex
      .select(["AT.*", knex.raw(subQuery)])
      .from(`${ACTIVITY_TEMPALTE.NAME} AS AT`)
      .where(
        `AT.${ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID}`,
        activity_template_id
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activity Template By ID",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No Activity Template Found For Given activity_template_id",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function checkActivityTemplateByIdPresence({
    activity_template_id,
    logTrace
  }) {
    const knex = this;
    const query = knex
      .select(ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID)
      .from(ACTIVITY_TEMPALTE.NAME)
      .where(
        ACTIVITY_TEMPALTE.COLUMNS.ACTIVITY_TEMPLATE_ID,
        activity_template_id
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activity Template By ID",
      logTrace
    });
    const response = await query;

    return response[0];
  }

  async function getActivityTemplateListWithPagination({ input, logTrace }) {
    const knex = this;
    const { current_page, page_size, filters } = input;
    const { categories, roles } = filters || {};
    const {
      ACTIVITY_TEMPLATE_ID,
      ACTIVITY_NAME,
      DESCRIPTION,
      CATEGORY,
      IS_ACTIVE,
      ACTIVITY_ROLE,
      START_TIME,
      END_BY_TIME,
      AUDIT
    } = ACTIVITY_TEMPALTE.COLUMNS;
    const query = knex
      .select([
        ACTIVITY_TEMPLATE_ID,
        ACTIVITY_NAME,
        DESCRIPTION,
        CATEGORY,
        IS_ACTIVE,
        ACTIVITY_ROLE,
        START_TIME,
        END_BY_TIME,
        AUDIT
      ])
      .from(ACTIVITY_TEMPALTE.NAME)
      .orderBy(ACTIVITY_NAME, "asc");

    if (categories?.length > 0) {
      query.whereIn(CATEGORY, categories);
    }
    if (roles?.length > 0) {
      query.whereIn(ACTIVITY_ROLE, roles);
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Activity Template List With Pagination",
      logTrace
    });
    return query.paginate({
      current_page,
      page_size
    });
  }

  async function getUniqueCategories({ logTrace }) {
    const knex = this;
    const { CATEGORY } = ACTIVITY_TEMPALTE.COLUMNS;

    const query = knex(ACTIVITY_TEMPALTE.NAME)
      .distinct(CATEGORY)
      .orderBy(CATEGORY, "asc");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Unique Categories",
      logTrace
    });

    const categoryRows = await query;
    return categoryRows.map(row => row[CATEGORY]);
  }

  async function getUniqueRoles({ logTrace }) {
    const knex = this;
    const { ACTIVITY_ROLE } = ACTIVITY_TEMPALTE.COLUMNS;

    const query = knex(ACTIVITY_TEMPALTE.NAME)
      .distinct(ACTIVITY_ROLE)
      .orderBy(ACTIVITY_ROLE, "asc");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Unique Roles",
      logTrace
    });

    const roleRows = await query;
    return roleRows.map(row => row[ACTIVITY_ROLE]);
  }

  return {
    upsertActivityTemplate,
    getActivityTemplateById,
    checkActivityTemplateByIdPresence,
    getActivityTemplateListWithPagination,
    getUniqueRoles,
    getUniqueCategories
  };
}

module.exports = activityTemplateRepo;
