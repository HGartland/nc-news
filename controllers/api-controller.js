const { fetchEndPoints } = require("../models/api-model");

exports.getEndPoints = (req, res, next) => {
  fetchEndPoints().then(endstr => {
    const endpoints = JSON.parse(endstr);
    res.status(200).send({ endpoints });
  });
};
