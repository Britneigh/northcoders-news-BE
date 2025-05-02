const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/api.controllers");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;