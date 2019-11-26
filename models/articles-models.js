const connection = require("../db/connection");

exports.fetchArticle = ({ article_id }) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id);
};
