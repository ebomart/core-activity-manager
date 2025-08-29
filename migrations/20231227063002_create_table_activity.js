exports.up = knex => {
  return knex.schema.hasTable("activity").then(exists => {
    if (!exists) {
      return knex.schema.createTable("activity", table => {
        table
          .uuid("activity_id")
          .primary()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("activity_template_id");
        table.string("activity_name");
        table.string("outlet_id");
        table.date("activity_date");
        table.time("start_time");
        table.time("end_by_time");
        table.time("expiry_time");
        table.integer("activity_duration_in_mins");
        table.timestamp("activity_start_datetime");
        table.time("completed_at");
        table.uuid("completed_by");
        table.jsonb("escalation");
        table.jsonb("activity_evidence");
        table.jsonb("checklist");
        table.string("status");
        table.text("comments");
        table.jsonb("audit");
        table.index(["activity_template_id"], "indx_activity_template_id");
        table.index(["outlet_id"], "indx_activity_outlet_id");
        table.index(["activity_date"], "indx_activity_date");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.dropTable("activity");
};
