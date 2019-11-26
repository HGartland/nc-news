exports.handleCustom = (err, req, res, next) => {
  if (err.msg) res.status(err.code).send({ msg: err.msg });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};
