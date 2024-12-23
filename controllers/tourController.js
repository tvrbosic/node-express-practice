const Tour = require('../models/tourModel');

// ------------------------------------< Handlers >------------------------------------
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   requestedAt: req.requestTime,
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    requestedAt: req.requestTime,
    // data: {
    //   tour: newTour,
    // },
  });
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
