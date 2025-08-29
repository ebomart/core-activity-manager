exports.up = knex => {
  return knex.schema.hasTable("activity_template").then(exists => {
    if (exists) {
      return knex.schema.table("activity_template", table => {
        table.string("activity_day_slot");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.hasTable("activity_template").then(exists => {
    if (exists) {
      return knex.schema.table("activity_template", table => {
        table.string("activity_day_slot");
      });
    }
    return false;
  });
};
