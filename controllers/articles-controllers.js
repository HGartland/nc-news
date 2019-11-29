const {
  fetchArticle,
  updateArticle,
  fetchAllArticles,
  insertArticle,
  killArticle
} = require("../models/articles-models");

const { checkTopicExists } = require("../models/topics-models");

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  return Promise.all([fetchAllArticles(req.query), checkTopicExists(req.query)])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  killArticle(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
