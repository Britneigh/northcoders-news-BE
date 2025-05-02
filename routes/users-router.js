const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/api.controllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;