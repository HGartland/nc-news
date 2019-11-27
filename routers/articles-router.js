const articlesRouter = require("express").Router();
const commentsRouter = require("./comments-router");
const {
  getArticle,
  patchArticle
} = require("../controllers/articles-controllers");

articlesRouter.use("/:article_id/comments", commentsRouter);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

module.exports = articlesRouter;
