//const {} =  require("../models/api.models");
const endpoints = require("../endpoints.json");

const getApi = (req, res) => {
    res.status(200).send({endpoints: endpoints});
};

module.exports = { getApi };