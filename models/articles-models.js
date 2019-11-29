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

exports.updateArticle = (article_id, votes) => {
  return connection("articles")
    .where(article_id)
    .increment(votes)
    .returning("*")
    .then(article => {
      return article.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : article;
    });
};

exports.fetchAllArticles = ({ sort_by, order, author, topic, limit, p }) => {
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
    })
    .orderBy(sort_by || "created_at", order || "desc");
};

exports.insertArticle = newArticle => {
  return connection("articles")
    .insert(newArticle)
    .returning("*");
};
