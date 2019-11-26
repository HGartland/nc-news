const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "invalid url" });
});

module.exports = app;
