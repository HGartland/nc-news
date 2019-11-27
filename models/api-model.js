const fsPromises = require("fs").promises;

exports.fetchEndPoints = () => {
  return fsPromises.readFile("./endpoints.json");
};
