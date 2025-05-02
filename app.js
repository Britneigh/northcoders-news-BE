const express = require("express");
const app = express();

const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"});
})

app.use((err, req, res, next) => {
    console.log(err, "<<<");
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad request"})
    } else if (err.code === "23503"){
        res.status(404).send({msg: "Not found"})
    } else if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    };
})

module.exports = app;