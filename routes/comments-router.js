const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/api.controllers");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;