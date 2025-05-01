const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
    if(err){
        console.log(err)
    } else {
    console.log(`Listening on ${PORT}...`);
    }
})