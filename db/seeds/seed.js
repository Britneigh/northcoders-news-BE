const db = require("../connection");
const format = require('pg-format');
const { convertTimestampToDate } = require("./utils");

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
      slug VARCHAR(50) PRIMARY KEY NOT NULL,
      description VARCHAR(100),
      img_url VARCHAR(1000)
      );`);
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR(50) PRIMARY KEY NOT NULL,
      name VARCHAR(40) NOT NULL,
      avatar_url VARCHAR(1000)
      );`);
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY NOT NULL,
      title VARCHAR(100) NOT NULL,
      topic VARCHAR(50),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      author VARCHAR(50),
      FOREIGN KEY (author) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      votes INT NOT NULL DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`);
  })
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY NOT NULL,
      article_id INT,
      FOREIGN KEY (article_id) REFERENCES articles(article_id),
      body TEXT,
      votes INT NOT NULL DEFAULT 0,
      author VARCHAR(50),
      FOREIGN KEY (author) REFERENCES users(username),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`);
  })
  //INSERT DATA
  .then(() => {
    //format data
    const formattedTopics = topicData.map((topic) => {
      return [
        topic.description,
        topic.slug,
        topic.img_url
      ];
    });
    //pg format
    const insertTopicsQuery = format(`INSERT INTO topics 
      (slug, description, img_url)
      VALUES %L`, formattedTopics);
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
      VALUES %L`, formattedUsers);
    return db.query(insertUsersQuery);
  })
  .then(() => {
    //format data
    const formattedArticles = articleData.map((article) => {
      const convertedArticle = convertTimestampToDate(article);
      return [
        article.title,
        article.body,
        convertedArticle.created_at,
        article.votes,
        article.article_img_url
      ];
    });
    //pg format
    const insertArticlesQuery = format(`INSERT INTO articles 
      (title, body, created_at, votes, article_img_url)
      VALUES %L`, formattedArticles);
    return db.query(insertArticlesQuery);
  })
  .then(() => {
    //format data
    const formattedCommentData = commentData.map((comment) => {
      const convertedComment = convertTimestampToDate(comment); //changes numbers to actual time stamp
      return [
        comment.body,
        comment.votes,
        convertedComment.created_at
      ];
    });
    //pg format
    const insertCommentsQuery = format(`INSERT INTO comments 
      (body, votes, created_at)
      VALUES %L`, formattedCommentData);
    return db.query(insertCommentsQuery);
  });
};
module.exports = seed;
