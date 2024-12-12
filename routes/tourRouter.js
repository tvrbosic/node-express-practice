const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();

// ------------------------------------< Parameter processing >------------------------------------

router.param('id', tourController.checkId);

// ------------------------------------< Routes >------------------------------------
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// ------------------------------------< Exports >------------------------------------
module.exports = router;
