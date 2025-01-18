// LIBRARY
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// APP
const app = express();
const AppError = require('./utils/appError');
const errorHandlingMiddleware = require('./middlewares/errorHandling');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// =======================< GLOBAL MIDDLEWARES >=======================
// Set HTTP security headers
app.use(helmet());

// Request rate limit
const limiter = rateLimit({
  max: 300,
  windowMs: 15 * 60 * 1000, // 15 min expressed in miliseconds
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json({ limit: '10kb' }));

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Sanitize data against XSS
app.use(xss());

// Prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Server static files
app.use(express.static(`${__dirname}/public`));

// Custom example/test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================< ROUTERS >=======================
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// =======================< Global error handling middleware >=======================
app.use(errorHandlingMiddleware);

module.exports = app;
