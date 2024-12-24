const Tour = require('../models/tourModel');
/**
 * REQUEST EXAMPLES:
 * - Filtering: 127.0.0.1:8000/api/v1/tours?duration=5&difficulty=easy
 * - Filtering and sorting: 127.0.0.1:8000/api/v1/tours?duration=5&difficulty=easy&sort=-price,ratingsAverage
 */

// =======================< Handlers >=======================
exports.getAllTours = async (req, res) => {
  try {
    // -------------< BUILD QUERY >-------------
    // 1) Basic filtering
    const queryParams = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryParams[element];
    });

    // 2) Advanced filtering
    let queryParamsString = JSON.stringify(queryParams);

    /**
     * Prepend every occurence of gte|gt|lte|lt with dollar sign.
     * This allows us to use MongoDB supported advanced filters on query.
     */
    queryParamsString = queryParamsString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryParamsString));

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // -------------< EXECUTE QUERY >-------------
    const tours = await query;

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
