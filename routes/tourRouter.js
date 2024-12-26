const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();

// =======================< Parameter processing (middleware) >=======================
// EXAMPLE: router.param('id', tourController.checkId);

// =======================< Alias routes >=======================
// Execute middleware before route controller
router
  .route('/top-5-by-ratings-and-price')
  .get(tourController.aliasTop5ByRatingsAndPrice, tourController.getAllTours);

// =======================< Routes >=======================
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// =======================< Exports >=======================
module.exports = router;
