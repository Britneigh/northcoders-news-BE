const { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertIntoComments } =  require("../models/api.models");
const endpoints = require("../endpoints.json");

const getApi = (req, res) => {
    res.status(200).send({endpoints: endpoints});
};

const getTopics = (req, res) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics});
    });
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
    })
}

const getArticles = (req, res) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send({articles: articles});
    })
}

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    return selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments: comments});
    })
    .catch((err) => {
        next(err)
    })
}

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    selectArticleById(article_id)
    .then(() => {
      return insertIntoComments(article_id, username, body)
    })
    .then((comment) => {
        res.status(201).send({comment: comment});
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment };