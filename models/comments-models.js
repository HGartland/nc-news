const connection = require("../db/connection");

exports.fetchCommentsByArticle = ({ article_id }) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .then(comments => {
      return comments.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : comments;
    });
};
