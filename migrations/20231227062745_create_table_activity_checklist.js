exports.up = knex => {
  return knex.schema.hasTable("activity_template_checklist").then(exists => {
    if (!exists) {
      return knex.schema.createTable("activity_template_checklist", table => {
        table
          .uuid("question_id")
          .primary()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("activity_template_id"); // NEED TO CREATE INDEX
        table.string("question_text");
        table.string("type");
        table.jsonb("options");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.index(
          ["activity_template_id"],
          "indx_template_checklist_template_id"
        );
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.dropTable("activity_template_checklist");
};
