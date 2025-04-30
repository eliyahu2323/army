const express = require("express");
const app = express();
// const swagger = require("./../swagger/SwaggerFile");

const userRouter = require("./UserRoute");

app.use("/api/v1/users", userRouter);
// app.use("/", swagger);
module.exports = app;
