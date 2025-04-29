const express = require("express");
const app = express();
const { getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment} = require("./controllers/api.controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"});
})

app.use((err, req, res, next) => {
    console.log(err, "<<<");
    if(err.code === "22P02" || err.code === "23503"){
        res.status(400).send({msg: "Bad request"})
    }else if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    };
})

module.exports = app;