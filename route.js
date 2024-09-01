const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json()); // To parse JSON request bodies

var tourRoute = express.Router();

app.use('/app/v1/tours', tourRoute);

const toursFilePath = './tours-simple.json'; // Path to the JSON file

// Utility function to read the JSON file
function readToursFile() {
  const data = fs.readFileSync(toursFilePath, 'utf-8');
  return JSON.parse(data);
}

// Utility function to write to the JSON file
function writeToursFile(tours) {
  fs.writeFileSync(toursFilePath, JSON.stringify(tours, null, 2));
}

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
  const tours = readToursFile();
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

function createNewTour(req, res) {
  const tours = readToursFile();
  const newTour = req.body;
  newTour.id = tours.length + 1; // Assign a new ID
  tours.push(newTour);
  writeToursFile(tours);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
}

function findTours(req, res) {
  const tours = readToursFile();
  const id = parseInt(req.params.id);
  const tour = tours.find(t => t.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
}

function updateTour(req, res) {
  const tours = readToursFile();
  const id = parseInt(req.params.id);
  const index = tours.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }

  tours[index] = { ...req.body, id }; // Replace the tour with the new data
  writeToursFile(tours);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[index]
    }
  });
}

function partiallyUpdateTour(req, res) {
  const tours = readToursFile();
  const id = parseInt(req.params.id);
  const index = tours.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }

  tours[index] = { ...tours[index], ...req.body }; // Merge the existing tour with the new data
  writeToursFile(tours);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[index]
    }
  });
}

function deleteTour(req, res) {
  const tours = readToursFile();
  const id = parseInt(req.params.id);
  const index = tours.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }

  tours.splice(index, 1); // Remove the tour from the array
  writeToursFile(tours);

  res.status(204).json({
    status: 'success',
    data: null
  });
}
