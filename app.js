const cors = require("cors");
const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();
app.use(cors());
app.use(express.json());
const {
  handle500s,
  handleCustom,
  handle422s,
  handle400s
} = require("./errors");

// -----ROUTES
app.use("/api", apiRouter);
// -----INVALID URL
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "invalid url" });
});

// -----ERROR CATCHERS
app.use(handle400s);
app.use(handle422s);
app.use(handleCustom);
app.use(handle500s);

module.exports = app;
