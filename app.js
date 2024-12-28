const express = require('express');
const morgan = require('morgan');

const app = express();
const AppError = require('./utils/appError');
const errorHandlingMiddleware = require('./middlewares/errorHandling');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// =======================< Middlewares >=======================
if (process.env.NODE_ENV === 'development') {
  // Logging
  app.use(morgan('dev'));
}

// Parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json());

// Server static files
app.use(express.static(`${__dirname}/public`));

// Custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================< Routers >=======================
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// =======================< Global error handling middleware >=======================
app.use(errorHandlingMiddleware);

module.exports = app;
