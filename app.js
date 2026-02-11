const express = require("express");
const itemsRoutes = require("./routes/items");
const ExpressError = require("./middleware/ExpressError");

const app = express();

app.use(express.json());
app.use("/items", itemsRoutes);

// 404 handler
app.use(function (req, res, next) {
  return next(new ExpressError("Not Found", 404));
});

// generic error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  return res.status(status).json({
    error: { message: err.message, status },
  });
});

module.exports = app;
