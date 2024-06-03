const express = require("express");
const {
  getArticleById,
  getArticles,
  getCommentsByArticle,
  addComment,
  updateArticle,
} = require("../controllers/controllers");
const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id/comments", getCommentsByArticle);
articlesRouter.post("/:article_id/comments", addComment);
articlesRouter.patch("/:article_id", updateArticle);

module.exports = articlesRouter;
