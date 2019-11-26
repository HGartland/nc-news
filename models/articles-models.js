const connection = require("../db/connection");

exports.fetchArticle = ({ article_id }) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(article => {
      return article.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : article;
    });
};

exports.updateArticle = ({ article_id }, updated_article) => {
  return connection("articles")
    .where("article_id", article_id)
    .update(updated_article)
    .returning("*")
    .then(article => {
      return article.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : article;
    });
};
