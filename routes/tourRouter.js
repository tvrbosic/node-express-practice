const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// =======================< Parameter processing (middleware) >=======================
// EXAMPLE: router.param('id', tourController.checkId);

// =======================< Alias routes >=======================
// Execute middleware before route controller
router
  .route('/top-5-by-ratings-and-price')
  .get(tourController.aliasTop5ByRatingsAndPrice, tourController.getAllTours);

// =======================< Aggregation routes >=======================
router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// =======================< Routes >=======================
router
  .route('/')
  .get(authController.protectRoute, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// =======================< Exports >=======================
module.exports = router;
