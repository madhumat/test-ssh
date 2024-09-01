const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json()); // To parse JSON request bodies

var tourRoute = express.Router();

app.use('/app/v1/tours', tourRoute);

// Route handlers
tourRoute.route('/')
  .get(getAllTours)       // GET: Fetch all tours
  .post(createNewTour);   // POST: Create a new tour

tourRoute.route('/:id')
  .get(findTours)         // GET: Fetch a specific tour by ID
  .put(updateTour)        // PUT: Completely update a tour by ID
  .patch(partiallyUpdateTour) // PATCH: Partially update a tour by ID
  .delete(deleteTour);    // DELETE: Delete a tour by ID

// Server code
const port = 3000;
app.listen(port, () => {
  console.log(`Hello, I am listening on port number ${port}`);
});

// Functions for handling routes
function getAllTours(req, res) {
  res.send('Get all tours');
}

function createNewTour(req, res) {
  res.send('Create a new tour');
}

function findTours(req, res) {
  const id = req.params.id;
  res.send(`Find tour with ID: ${id}`);
}

function updateTour(req, res) {
  const id = req.params.id;
  const newTourData = req.body;
  res.send(`Completely updated tour with ID: ${id}`);
}

function partiallyUpdateTour(req, res) {
  const id = req.params.id;
  const updatedFields = req.body;
  res.send(`Partially updated tour with ID: ${id}`);
}

function deleteTour(req, res) {
  const id = req.params.id;
  res.send(`Deleted tour with ID: ${id}`);
}
