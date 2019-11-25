exports.up = function(knex) {
  console.log("creating article and comments tables...");
  return knex.schema
    .createTable("articles", articlesTable => {
      articlesTable.increments("article_id").primary();
      articlesTable.string("title").notNullable();
      articlesTable.string("body").notNullable();
      articlesTable.integer("votes").defaultTo(0);
      articlesTable
        .string("author")
        .references("username")
        .inTable("users");
      articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex.schema.createTable("comments", commentsTable => {
        commentsTable.increments("comments_id").primary();
        commentsTable
          .string("author")
          .references("username")
          .inTable("users");
        commentsTable
          .integer("article_id")
          .references("article_id")
          .inTable("articles");
        commentsTable.integer("votes").defaultTo(0);
        commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
        commentsTable.string("body").notNullable();
      });
    });
};

exports.down = function(knex) {
  console.log("removing articles and comments tables...");
  return knex.schema.dropTable("comments").then(() => {
    return knex.schema.dropTable("articles");
  });
};
