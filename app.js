const fs = require('fs');
const express = require('express');

const app = express();

// Middleware function which parses incoming requests with JSON payloads and is based on body-parser
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get tour details
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // Not found or invalid id
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour for given ID was not found!',
    });
  }
  // Success
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Create tour
app.post('/api/v1/tours', (req, res) => {
  // Currently  we have no database and new tour will be stored in json file.
  // For that reason we have to handle id's manually
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Update tour
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // Not found or invalid id
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour for given ID was not found!',
    });
  }
  // Actual update is not implemented to keep it simple !!!
  res.status(200).json({
    status: 'success',
    data: {
      tour: `Tour (ID: ${id}) updated!`,
    },
  });
});

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
