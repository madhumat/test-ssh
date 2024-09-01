
 const Tour = require("./../model/tourModel"); //JSON.parse(fs.readFileSync(`./tours-simple.json`, 'utf-8'));



//functions
exports.getAllTours = async (req, res) => {
    try {
        // Fetch all tours from the database
        const tours = await Tour.find();

        // Log the tours for debugging purposes
        console.log("Tours", tours);

        // Send the successful response with tours data
        res.status(200).send({
            message: 'success',
            status: 200,
            length: tours.length,
            data: { tours: tours },
        });
    } catch (error) {
        // Handle any errors that occur during the operation
        console.error("Error fetching tours:", error);

        // Send an error response
        res.status(500).send({
            message: 'An error occurred while fetching tours',
            status: 500,
            error: error.message,
        });
    }
};

exports.createNewTour = async (req, res) => {
    try {
        // Extract the tour data from the request body
        //const tourData = req.body;

        // Create a new tour using the extracted data
        const newTour = await Tour.create(req.body);

        // Log the created tour for debugging purposes
        console.log("New Tour Created", newTour);

        // Send a successful response with the created tour data
        res.status(201).send({
            message: 'Tour created successfully',
            status: 201,
            data: { tour: newTour },
        });
    } catch (error) {
        // Handle any errors that occur during the creation process
        console.error("Error creating tour:", error);

        // Send an error response
        res.status(500).send({
            message: 'An error occurred while creating the tour',
            status: 500,
            error: error.message,
        });
    }
};


exports.findtours = async (req, res) => {
    try {

        const tourId =req.params.id;
        // Fetch all tours from the database
        const tours = await Tour.find(tourId);

        // Log the tours for debugging purposes
        console.log("Tours", tours);

        // Send the successful response with tours data
        res.status(200).send({
        message: 'success',
        status: 200,
        length: tours.length,
        data: { tours: tours },
    });
} catch (error) {
    // Handle any errors that occur during the operation
    console.error("Error finding the tour:", error);

    // Send an error response
    res.status(500).send({
        message: 'An error occurred while finding tours',
        status: 500,
        error: error.message,
    });
}
};
// exports.DeleteTour = (req, res) => {
//   const Id = req.params.id * 1;
//   const deleteTour = tours.find((el) => el.id === Id);
//   if (!deleteTour) {
//     res.status(200).send({ message: 'not found !!!', status: 204 });
//   } else {
//     console.log('you can send anything in the post here /');
//     res.send('you can send anything in the post here');
//   }
// };
exports.updateTour = (req, res) => {
  const Id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === Id);

  if (!tourIndex) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found!',
    });
  }

  const updatedTour = { ...tours[tourIndex], ...req.body };
  tours[tourIndex] = updatedTour;

  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(tours)
  );

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  });
};
exports.patchTour = (req, res) => {
  const Id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === Id);

  if (!tourIndex) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found!',
    });
  }

  const patchedTour = { ...tours[tourIndex], ...req.body };
  tours[tourIndex] = patchedTour;

  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(tours)
  );

  res.status(200).json({
    status: 'success',
    data: {
      tour: patchedTour
    }
  });
};
exports.deleteTour = (req, res) => {
  const Id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === Id);

  if (!tourIndex) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found!',
    });
  }

  tours.splice(tourIndex, 1);

  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(tours)
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
};
