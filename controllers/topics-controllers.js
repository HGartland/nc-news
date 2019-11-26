const { fetchTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then(() => {
    res.sendStatus(200);
  });
};
