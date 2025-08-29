exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("activity_template"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("activity_template", table => {
          table
            .uuid("activity_template_id")
            .primary()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table.string("activity_name");
          table.string("description");
          table.string("category");
          table.string("priority");
          table.string("activity_role");
          table.string("type");
          table.jsonb("repeat_info");
          table.date("start_from");
          table.time("start_time");
          table.time("end_by_time");
          table.time("expiry_time");
          table.integer("activity_duration_in_mins");
          table.string("activity_evidence_type");
          table.boolean("is_evidence_mandatory");
          table.jsonb("escalation");
          table.boolean("is_active");
          table.jsonb("audit");
          table.index(["activity_role"], "indx_template_activity_role");
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("activity_template");
};
