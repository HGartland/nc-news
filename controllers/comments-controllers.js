const {
  fetchCommentsByArticle,
  insertComment
} = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  fetchCommentsByArticle(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  newComment = {
    author: req.body.username,
    body: req.body.body,
    article_id: req.params.article_id
  };
  insertComment(newComment)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};
