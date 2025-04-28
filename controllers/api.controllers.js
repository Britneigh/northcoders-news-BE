const { selectTopics, selectArticleById } =  require("../models/api.models");
const endpoints = require("../endpoints.json");

const getApi = (req, res) => {
    res.status(200).send({endpoints: endpoints});
};

const getTopics = (req, res) => {
    return selectTopics()
    .then((topics) => {
        console.log(topics);
        res.status(200).send({topics: topics});
    });
}

const getArticleById = (req, res) => {
    const { article_id } = req.params;
    return selectArticleById(article_id)
    .then((article) => {
        console.log(article);
        res.status(200).send({article: article})
    })
}
module.exports = { getApi, getTopics, getArticleById };