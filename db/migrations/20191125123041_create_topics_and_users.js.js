exports.up = function(knex) {
  // console.log("creating topics and users tables...");
  return knex.schema
    .createTable("topics", topicsTable => {
      topicsTable
        .string("slug")
        .unique()
        .primary();
      topicsTable.string("description").notNullable();
    })
    .then(() => {
      return knex.schema.createTable("users", usersTable => {
        usersTable
          .string("username")
          .unique()
          .primary();
        usersTable.string("avatar_url").notNullable();
        usersTable.string("name").notNullable();
      });
    });
};

exports.down = function(knex) {
  // console.log("removing topics and users tables...");
  return knex.schema.dropTable("topics").then(() => {
    return knex.schema.dropTable("users");
  });
};
