const articlesRouter = require("express").Router();
const { 
    getArticleById,
    getArticles,
    patchArticle,
    getCommentsByArticleId,
    postComment,
} = require("../controllers/api.controllers");

articlesRouter.get("/", getArticles);

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticle);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postComment);

module.exports = articlesRouter;