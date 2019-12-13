const {
  fetchCommentsByArticle,
  insertComment,
  updateComment,
  killComment
} = require("../models/comments-models");

const {
  checkArticleExists,
  fetchAllArticles
} = require("../models/articles-models");

exports.getCommentsByArticle = (req, res, next) => {
  return Promise.all([
    fetchCommentsByArticle(req.params, req.query),
    fetchAllArticles(req.params)
  ])
    .then(([comments, article]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = {
    author: req.body.username,
    body: req.body.body,
    article_id: req.params.article_id
  };
  insertComment(newComment)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  updateComment(req.params, req.body)
    .then(([comment]) => {
      res.status(200).send({ comment });
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
