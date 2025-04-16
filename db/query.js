const db = require("./connection.js");

function seed()  {
    db.query(`SELECT * FROM users;`)
    .then((result) => {
        console.log("Get all of the users -------->", result);
    });
    db.query(`SELECT * FROM articles WHERE topic = 'coding';`)
    .then((result) => {
        console.log("Get all of the articles where the topic is coding -------->", result);
    });
    db.query(`SELECT * FROM comments WHERE votes < 0;`)
    .then((result) => {
        console.log("Get all of the comments where the votes are less than zero -------->", result);
    });
    db.query(`SELECT * FROM topics;`)
    .then((result) => {
        console.log("Get all of the topics -------->", result);
    });
    db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`)
    .then((result) => {
        console.log("Get all of the articles by user grumpy19 -------->", result);
    });
    db.query(`SELECT * FROM comments WHERE votes > 10;`)
    .then((result) => {
        console.log("Get all of the comments that have more than 10 votes -------->", result);
    });
    db.end();
}

seed();