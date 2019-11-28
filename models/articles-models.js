const connection = require("../db/connection");

exports.checkArticleExists = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where(article_id)
    .then(articles => {
      return !articles.length
        ? Promise.reject({ code: 404, msg: "data not found" })
        : articles;
    });
};

exports.fetchArticle = ({ article_id }) => {
  return connection
    .select("articles.*")
    .count("comment_id AS comments_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
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

exports.fetchAllArticles = ({ sort_by, order, author, topic }) => {
  return connection
    .select("*")
    .from("articles")
    .modify(query => {
      if (author) query.where({ author });
      if (topic) query.where({ topic });
    })
    .orderBy(sort_by || "created_at", order || "desc");
};
