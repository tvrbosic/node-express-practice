/**
 * Execute script in terminal: node import-tours-data.js <ACTION_ARGUMENT>
 * Where ACTION_ARGUMENT can be:
 * --import
 * --delete
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

// ------------------< Load environment variables >------------------
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// --------------------< Connect database >--------------------
mongoose.connect(DB).then(() => {
  console.log('Database connection was successful!');
});

// --------------------< Functions >--------------------
const importToursData = async () => {
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// --------------------< Delete data from DB >--------------------
const deleteToursData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// --------------------< Script execution >--------------------
if (process.argv[2] === '--import') importToursData();
if (process.argv[2] === '--delete') deleteToursData();
