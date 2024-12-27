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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
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

exports.getTourStats = async (req, res) => {
  try {
    // Aggregation pipeline (https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 3 } },
      },
      {
        $group: {
          // _id: null, // Every resulting record will have same id (null). All resulting records will be in same group.
          _id: { $toUpper: '$difficulty' }, // Group resulting records by difficulty.
          numberOfRatings: { $sum: '$ratingsQuantity' },
          numberOfTours: { $sum: 1 }, // Add 1 for each document that will go through pipeline
          averageRating: {
            $avg: '$ratingsAverage',
          },
          averagePrice: {
            $avg: '$price',
          },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $max: '$price',
          },
        },
      },
      {
        // In this stage we need to use field names defined in previous stage (initial model fields does not exist in this stage)
        $sort: {
          averagePrice: 1,
        },
      },
      // EXAMPLE: stages could be repeated (exclude EASY group)
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' },
      //   },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            // Between first and last day of year provided in request parameters
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: '$startDates',
          },
          numberOfTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numberOfTours: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
