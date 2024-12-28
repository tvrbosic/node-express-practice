/**
 * A higher-order function to wrap asynchronous route handlers in an Express.js application.
 *
 * This function ensures that any errors thrown by the wrapped async function are
 * automatically passed to the next middleware in the chain (typically an error-handling middleware).
 *
 * @param {Function} fn - The asynchronous function to wrap. This function should
 *                        follow the Express.js middleware signature (req, res, next).
 * @returns {Function} - A new function that wraps the original function, catches
 *                       any errors, and forwards them to the `next` function.
 *
 * Usage:
 * const catchAsync = require('./catchAsync');
 *
 * app.get('/route', catchAsync(async (req, res, next) => {
 *   // Your async logic here
 * }));
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
