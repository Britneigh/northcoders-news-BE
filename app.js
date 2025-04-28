const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/api.controllers");


app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

module.exports = app;