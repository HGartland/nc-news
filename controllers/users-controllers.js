const { fetchUserByUsername } = require("../models/users-models");

exports.getUser = (req, res, next) => {
  console.log(req.params);
  fetchUserByUsername(req.params).then(user => {
    res.status(200).send({ user: user[0] });
  });
};
