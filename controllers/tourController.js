const fs = require('fs');

// ######################## Read data ########################
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  const id = val * 1;
  const tour = tours.find((el) => el.id === id);

  // Not found or invalid id
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour for given ID was not found!',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price!',
    });
  }
  next();
};

// ######################## Handlers ########################
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  // Actual update is not implemented to keep it simple !!!
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: `Tour (ID: ${id}) updated!`,
    },
  });
};

exports.deleteTour = (req, res) => {
  // Actual delete is not implemented to keep it simple !!!
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
};
