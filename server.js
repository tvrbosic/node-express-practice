const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// ------------------< Server configuration >------------------
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// --------------------< Connect database >--------------------
mongoose.connect(DB).then(() => {
  console.log('Database connection was successful!');
});

// ----------------------< Start server >----------------------
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
