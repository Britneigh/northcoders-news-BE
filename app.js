const express = require("express");
const app = express();
const { getApi, getTopics, getArticleById } = require("./controllers/api.controllers");


app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"});
})

module.exports = app;