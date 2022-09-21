const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// ######################## Middlewares ########################
// Middleware function which parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json());
app.use(morgan('dev'));

// Custom middleware
app.use((req, res, next) => {
  console.log('Custom middleware triggered!');
  next();
});
// Custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
