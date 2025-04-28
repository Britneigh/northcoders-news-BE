const { selectTopics } =  require("../models/api.models");
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
module.exports = { getApi, getTopics };