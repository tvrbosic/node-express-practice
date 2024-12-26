const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

/**
 * REQUEST EXAMPLES:
 * - Filtering: 127.0.0.1:8000/api/v1/tours?duration=5&difficulty=easy
 * - Filtering and sorting: 127.0.0.1:8000/api/v1/tours?duration=5&difficulty=easy&sort=-price,ratingsAverage
 * - Field limiting: 127.0.0.1:8000/api/v1/tours?fields=name,duration,difficulty,price
 */

// =======================< Route middlewares >=======================
exports.aliasTop5ByRatingsAndPrice = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// =======================< Route handlers >=======================
exports.getAllTours = async (req, res) => {
  try {
    // -------------< BUILD AND EXECUTE QUERY >-------------
    const apiFeatures = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await apiFeatures.query;

    // -------------< SEND RESPONSE >-------------
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: newTour,
      },
    });
  } catch {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return new document with updated values
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
