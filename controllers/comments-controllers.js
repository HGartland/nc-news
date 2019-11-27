const {
  fetchCommentsByArticle,
  insertComment,
  updateComment,
  killComment
} = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  fetchCommentsByArticle(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = {
    author: req.body.username,
    body: req.body.body,
    article_id: req.params.article_id
  };
  console.log(newComment);
  insertComment(newComment)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const incVotes = req.body.inc_votes;
  updateComment(req.params, { votes: incVotes })
    .then(comment => {
      res.status(200).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  killComment(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
