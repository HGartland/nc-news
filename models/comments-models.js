const connection = require("../db/connection");

exports.fetchCommentsByArticle = ({ article_id }, { sort_by, order }) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc");
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
