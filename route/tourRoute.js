
const express = require('express');
var tourRoute = express.Router();
const tourController = require('../controller/tourController');

//tourRoute.param('id',tourController.checkId);
tourRoute.route('/aliasTopTours')
.get(tourController.aliasTopTours,tourController.getAllTours)

tourRoute.route('/stats')
.get(tourController.getTourStats);

tourRoute.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan);


//route handlers
tourRoute.route('/')
.get(tourController.getAllTours)
.post(tourController.createNewTour)
.delete(tourController.deleteTour);

tourRoute.route('/:id')
.get(tourController.findtours)
.put(tourController.updateTour)
.patch(tourController.patchTour);



module.exports =tourRoute;


  