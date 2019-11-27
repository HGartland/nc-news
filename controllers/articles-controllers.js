const {
  fetchArticle,
  updateArticle,
  fetchAllArticles
} = require("../models/articles-models");

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then(updated_article => {
      res.status(200).send({ updated_article: updated_article[0] });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
