const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  getAllArticles
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticle,
  postComment
} = require("../controllers/comments-controllers");

const { handle405s } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

module.exports = articlesRouter;
