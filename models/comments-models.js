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

exports.insertComment = newComment => {
  return connection("comments")
    .insert(newComment)
    .returning("*");
};

exports.updateComment = ({ comment_id }, incVotes) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment(incVotes)
    .returning("*")
    .then(comment => {
      return comment.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : comment;
    });
};

exports.killComment = ({ comment_id }) => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deleted => {
      return deleted === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : deleted;
    });
};
