const { fetchCommentsByArticle } = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  console.log(req.params, "<----------- PARAMS");
  fetchCommentsByArticle(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
