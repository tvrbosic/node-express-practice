const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

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

// ######################## Read data ########################
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ######################## Route handlers ########################
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
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
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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
        requestedAt: req.requestTime,
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
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
    requestedAt: req.requestTime,
    data: {
      tour: `Tour (ID: ${id}) updated!`,
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // Not found or invalid id
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour for given ID was not found!',
    });
  }
  // Actual delete is not implemented to keep it simple !!!
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
};

// ######################## Routes ########################
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// ######################## Start server ########################
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
