const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();
const { handle500s, handleCustom } = require("./errors");

// ROUTES
app.use("/api", apiRouter);

// ERROR CATCHERS
app.use(handleCustom);
app.use(handle500s);

// INVALID URL
app.all("/*", (req, res, next) => {
  console.log(req.url, "<-------------URL INVALID");
  res.status(404).send({ msg: "invalid url" });
});

module.exports = app;
