const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `ערך לא תקין בשדה '${err.path}': '${err.value}'.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `השדה '${field}' עם הערך '${value}' כבר קיים במערכת. אנא השתמש בערך אחר.`;
  return new AppError(message, 409); // 409 Conflict
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `קלט לא תקין: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('אסימון לא תקין. אנא התחבר מחדש.', 401);

const handleJWTExpiredError = () =>
  new AppError('האסימון שלך פג תוקף. אנא התחבר מחדש.', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'משהו השתבש',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // אם השגיאה היא ידועה (operational)
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // שגיאה לא צפויה
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'משהו השתבש במערכת, אנא נסה שוב מאוחר יותר.',
    });
  }

  // למקרים שאינם API (לדוגמה, דפי האתר)
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'משהו השתבש',
      msg: err.message,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'משהו השתבש',
    msg: 'אנא נסה שוב מאוחר יותר.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // יוצרים העתק נקי של השגיאה
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;
    error.keyValue = err.keyValue;
    error.errors = err.errors;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
