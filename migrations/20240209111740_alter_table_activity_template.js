exports.up = knex => {
  return knex.schema.hasTable("activity_template").then(exists => {
    if (exists) {
      return knex.schema.table("activity_template", table => {
        table.timestamp("start_datetime");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.hasTable("activity_template").then(exists => {
    if (exists) {
      return knex.schema.table("activity_template", table => {
        table.dropColumn("start_datetime");
      });
    }
    return false;
  });
};
