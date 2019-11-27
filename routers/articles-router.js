const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticle,
  postComment
} = require("../controllers/comments-controllers");

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

module.exports = articlesRouter;
