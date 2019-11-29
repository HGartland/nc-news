const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select("slug", "description").from("topics");
};

exports.checkTopicExists = ({ topic }) => {
  return connection
    .select("*")
    .from("topics")
    .modify(query => {
      if (topic) query.where("slug", topic);
    })
    .then(topics => {
      return !topics.length
        ? Promise.reject({ code: 404, msg: "data not found" })
        : topics;
    });
};
