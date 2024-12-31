const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Must be at top of imports because other modules are using environment variables loaded from this file
const mongoose = require('mongoose');
const app = require('./app');

// ------------------< Server configuration >------------------
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// --------------------< Connect database >--------------------
mongoose.connect(DB).then(() => {
  console.log('Database connection was successful!');
});

// ----------------------< Start server >----------------------
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection occured! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception occured! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
