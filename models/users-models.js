const connection = require("../db/connection");

exports.fetchUserByUsername = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      return user.length === 0
        ? Promise.reject({ code: 404, msg: "data not found" })
        : user;
    });
};
