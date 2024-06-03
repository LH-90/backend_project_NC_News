const express = require("express");
const { deleteComment } = require("../controllers/controllers");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
