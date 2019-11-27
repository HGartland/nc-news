exports.handle400s = (err, req, res, next) => {
  const errors = ["22P02", "42703"];
  if (errors.includes(err.code)) res.status(400).send({ msg: "bad request" });
  else next(err);
};

exports.handle422s = (err, req, res, next) => {
  const errors = ["23503"];
  if (errors.includes(err.code))
    res.status(422).send({ msg: "unprocessable entry" });
  else next(err);
};

exports.handleCustom = (err, req, res, next) => {
  if (err.msg) res.status(err.code).send({ msg: err.msg });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, "<----- ERROR HERE");
  res.status(500).send({ msg: "server error" });
};
