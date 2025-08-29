exports.up = knex => {
  return knex.schema.hasTable("activity_template").then(exists => {
    if (exists) {
      return knex.schema.table("activity_template", table => {
        table.dropColumn("is_evidence_mandatory");
        table.dropColumn("activity_evidence_type");
        table.jsonb("activity_evidences");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.hasTable("activity_template").then(exists => {
    if (exists) {
      return knex.schema.table("activity_template", table => {
        table.string("activity_evidence_type");
        table.boolean("is_evidence_mandatory");
        table.dropColumn("activity_evidences");
      });
    }
    return false;
  });
};
