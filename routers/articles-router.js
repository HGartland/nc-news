const articlesRouter = require("express").Router();
const { getArticle } = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(getArticle);

module.exports = articlesRouter;