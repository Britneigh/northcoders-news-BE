const { 
    selectTopics,
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    insertIntoComments,
    updateArticle,
    removeComment,
    selectUsers
 } =  require("../models/api.models");

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

const patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    selectArticleById(article_id)
    .then(() => {
      return updateArticle(article_id, inc_votes)
    })
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle: updatedArticle});
    })
    .catch((err) => {
        next(err)
    })
}

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removeComment(comment_id)
    .then((deletedComment) => {
        res.status(204).send({deletedComment: deletedComment});
    })
    .catch((err) => {
        next(err)
    })
}

const getUsers = (req, res) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({users: users});
    })
}

module.exports = { 
    getApi,
    getTopics,
    getArticleById,
    getArticles,
    getCommentsByArticleId,
    postComment,
    patchArticle,
    deleteComment,
    getUsers
};