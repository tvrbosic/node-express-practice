const express = require('express');

const tourController = require('../controllers/tourController');

// ######################## Routes ########################
const router = express.Router();

router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// ######################## Exports ########################
module.exports = router;
