
const express = require('express');
var tourRoute = express.Router();
const tourController = require('../controller/tourController');

//tourRoute.param('id',tourController.checkId);
tourRoute.route('/aliasTopTours')
.get(tourController.aliasTopTours,tourController.getAllTours)


tourRoute.route('/getImagesAndCovers')
.get(tourController.getImagesAndCovers);

tourRoute.route('/getToursByYear')
.get(tourController.getToursByYear);

tourRoute.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan);

tourRoute.route('/getMaxGroupSize')
.get(tourController.getMaxGroupSize);

tourRoute.route('/stats')
.get(tourController.getTourStats);




//route handlers
tourRoute.route('/')
.get(tourController.getAllTours)
.post(tourController.createNewTour);


tourRoute.route('/:id')
.get(tourController.findtours)
.put(tourController.updateTour)
.patch(tourController.patchTour)
.delete(tourController.deleteTour);



module.exports =tourRoute;


  