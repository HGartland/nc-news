const { fetchCommentsByArticle } = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  fetchCommentsByArticle(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {};
