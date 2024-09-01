
const express = require('express');
var tourRoute = express.Router();
const tourController = require('../controller/tourController');

//tourRoute.param('id',tourController.checkId);
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


  