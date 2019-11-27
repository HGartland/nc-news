const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle
} = require("../controllers/articles-controllers");
const { getCommentsByArticle } = require("../controllers/comments-controllers");

articlesRouter.route("/:article_id/comments").get(getCommentsByArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

module.exports = articlesRouter;
