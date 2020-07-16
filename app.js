const express = require("express");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const chargeRouter = require("./routes/api/charge/charge");
const chargeStatusesRouter = require("./routes/api/charge-statuse/charge-statuses");
const app = express();

const BASE_URL = "/api";
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.configuration = {
    mockServerUrl: "https://interview.riskxint.com"
  };

  next();
});

app.use("/", indexRouter);
app.use(BASE_URL + "/charge", chargeRouter);
app.use(BASE_URL + "/chargeStatuses", chargeStatusesRouter);
module.exports = app;
