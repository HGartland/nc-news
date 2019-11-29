const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  getAllArticles,
  postArticle,
  deleteArticle
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticle,
  postComment
} = require("../controllers/comments-controllers");

const { handle405s } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(handle405s);

module.exports = articlesRouter;
