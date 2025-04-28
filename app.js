const express = require("express");
const app = express();
const { getApi, getTopics, getArticleById } = require("./controllers/api.controllers");


app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"});
})

app.use((err, req, res, next) => {
    console.log(err, "<<<");
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad request"})
    }else if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    };
})

module.exports = app;