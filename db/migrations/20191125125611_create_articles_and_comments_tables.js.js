exports.up = function(knex) {
  return knex.schema
    .createTable("articles", articlesTable => {
      articlesTable.increments("article_id").primary();
      articlesTable.string("title").notNullable();
      articlesTable.string("body", 2000).notNullable();
      articlesTable.integer("votes").defaultTo(0);
      articlesTable.string("topic").references("topics.slug");
      articlesTable.string("author").references("users.username");
      articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex.schema.alterTable("articles", function(table) {
        table.unique(["title", "topic"]);
      });
    })
    .then(() => {
      return knex.schema.createTable("comments", commentsTable => {
        commentsTable.increments("comment_id").primary();
        commentsTable
          .string("author")
          .references("username")
          .inTable("users")
          .notNullable();
        commentsTable
          .integer("article_id")
          .references("article_id")
          .inTable("articles")
          .onDelete("CASCADE");
        commentsTable.integer("votes").defaultTo(0);
        commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
        commentsTable.string("body", 2000).notNullable();
      });
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments").then(() => {
    return knex.schema.dropTable("articles");
  });
};
