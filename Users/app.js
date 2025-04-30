const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const globalErrorHandler = require("./controllers/ErrorController");

const routes = require("./routes/Index");

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://91.223.106.198:3000", // Change this to your client domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: " Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ["name", "group", "email", "phone", "role", "location"],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(routes);

app.use(globalErrorHandler);

module.exports = app;
