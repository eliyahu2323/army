const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const moment = require('moment-timezone');

const globalErrorHandler = require('./controllers/ErrorController');
const Product = require('./models/ProductModel');

const routes = require('./routes/Index');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: ' Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

async function resetStatus() {
  try {
    await Product.updateMany({}, { $set: { status_product: false } });
    console.log('Status reset successfully');
  } catch (error) {
    console.error('Error resetting status:', error);
    throw error; // Re-throw the error to be caught by the global error handler
  }
}

cron.schedule('00 00 * * *', async () => {
  try {
    const israelTime = moment().tz('Asia/Jerusalem');
    console.log('Current Israel time:', israelTime.format());
    await resetStatus();
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(routes);

app.use(globalErrorHandler);

module.exports = app;
