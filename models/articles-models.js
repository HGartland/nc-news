const connection = require("../db/connection");

exports.checkArticleExists = ({ article_id }) => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
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

exports.updateArticle = (article_id, { inc_votes }) => {
  return connection("articles")
    .where(article_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then(article => {
      return article.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : article;
    });
};

exports.fetchAllArticles = ({
  sort_by,
  order,
  author,
  topic,
  limit,
  p,
  article_id
}) => {
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "articles.created_at",
      "articles.title",
      "articles.topic",
      "articles.votes"
    )
    .count("comment_id AS comments_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
      if (limit) query.limit(limit);
      if (limit && p) query.offset((p - 1) * limit);
      if (article_id) query.where("articles.article_id", article_id);
    })
    .orderBy(sort_by || "created_at", order || "desc")
    .then(articles => {
      return articles.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : articles;
    });
};

exports.insertArticle = newArticle => {
  return connection("articles")
    .insert(newArticle)
    .returning("*");
};

exports.killArticle = ({ article_id }) => {
  return connection("articles")
    .where({ article_id })
    .del()
    .then(deleted => {
      return deleted === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : deleted;
    });
};
