const db = require("./connection.js");

function seed()  {
    db.query(`SELECT * FROM users`)
    .then((result) => {
        console.log(result);
    });
    db.end();
}

seed();