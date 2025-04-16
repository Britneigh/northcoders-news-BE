const db = require("../connection");
const format = require('pg-format');
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  //DROP TABLE
  return db
  .query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles;`);
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics;`);
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users;`);
  })
  //CREATE TABLE
  .then(() => {
    return db.query(`CREATE TABLE topics(
      slug VARCHAR(50) PRIMARY KEY,
      description VARCHAR(100) NOT NULL,
      img_url VARCHAR(1000)
      );`);
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      avatar_url VARCHAR(1000)
      );`);
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      topic VARCHAR(50) REFERENCES topics(slug),
      author VARCHAR(50) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`);
  })
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT NOT NULL DEFAULT 0,
      author VARCHAR(50) REFERENCES users(username),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`);
  })
  //INSERT DATA
  .then(() => {
    //format data
    const formattedTopics = topicData.map((topic) => {
      return [
        topic.slug,
        topic.description,
        topic.img_url
      ];
    });
    //pg format
    const insertTopicsQuery = format(`INSERT INTO topics 
      (slug, description, img_url)
      VALUES %L;`, formattedTopics);
    return db.query(insertTopicsQuery);
  })
  .then(() => {
    //format data
    const formattedUsers = userData.map((user) => {
      return [
        user.username,
        user.name,
        user.avatar_url
      ];
    });
    //pg format
    const insertUsersQuery = format(`INSERT INTO users 
      (username, name, avatar_url)
      VALUES %L;`, formattedUsers);
    return db.query(insertUsersQuery);
  })
  .then(() => {
    //format data
    const formattedArticles = articleData.map((article) => {
      const convertedArticle = convertTimestampToDate(article);
      return [
        convertedArticle.title,
        convertedArticle.topic,
        convertedArticle.author,
        convertedArticle.body,
        convertedArticle.created_at,
        convertedArticle.votes,
        convertedArticle.article_img_url
      ];
    });
    //pg format
    const insertArticlesQuery = format(`INSERT INTO articles 
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L RETURNING *;`, formattedArticles);
    return db.query(insertArticlesQuery);
  })
  .then((result) => {
      const articlesRefObject = createRef(result.rows);
      //format commentData
      const formattedComments = commentData.map((comment) => {
        const convertedComment = convertTimestampToDate(comment); //changes numbers to actual time stamp
        return [
          articlesRefObject[comment.article_title],
          convertedComment.body,
          convertedComment.votes,
          convertedComment.author,
          convertedComment.created_at
        ];
      });
      //pg format
      const insertCommentsQuery = format(`INSERT INTO comments 
      (article_id, body, votes, author, created_at)
      VALUES %L;`, formattedComments);
      return db.query(insertCommentsQuery);
  })
  .then(() => {
   console.log("Seed complete");
  });
};
module.exports = seed;
