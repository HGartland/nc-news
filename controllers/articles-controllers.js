const { fetchArticle } = require("../models/articles-models");

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params).then(article => {
    res.status(200).send({ article: article[0] });
  });
};
