const db = require(".././db/connection");

const selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then ((result) => {
        return result.rows;
    });
}

const selectArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not found"});
        } else {
            return result.rows[0];
        }    
    })
}

const selectArticles = () => {
return db.query(`SELECT
  articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id)::INT AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`)
    .then ((result) => {
        return result.rows;
    });    
}

const selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at ASC;`, [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not found"});
        } else {
            return result.rows;
        }
    })
}

const insertIntoComments = (article_id, username, body) => {
    if(!article_id || !username || !body){
        return Promise.reject({status: 400, msg: "Bad request"});
    }

    return db
    .query(
        `INSERT INTO comments (article_id, author, body)
         VALUES ($1, $2, $3) RETURNING *;`, [article_id, username, body])
    .then((result) => {
        return result.rows[0];
    })
}

const updateArticle = (article_id, inc_votes) => {
    if(!article_id || !inc_votes){
        return Promise.reject({status: 400, msg: "Bad request"});
    }

    return db
    .query(
        `UPDATE articles SET votes = votes + $2 WHERE article_id = $1
         RETURNING *;`, [article_id, inc_votes])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not found"});
        } else {
        return result.rows[0];
        }
    })
}

const removeComment = (comment_id) => {
    return db
    .query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not found"});
        } else {
        return result.rows[0];
        }
    })
}

module.exports = { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId, insertIntoComments, updateArticle, removeComment };