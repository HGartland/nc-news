const commentsRouter = require("express").Router();
const { getCommentsByArticle } = require("../controllers/comments-controllers");

commentsRouter.route("/").get(getCommentsByArticle);

module.exports = commentsRouter;
