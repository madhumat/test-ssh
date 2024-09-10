const { query } = require("express");
const Tour = require("./../model/tourModel"); //JSON.parse(fs.readFileSync(`./tours-simple.json`, 'utf-8'));
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/AppError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//functions
exports.getAllTours = async (req, res) => {
  // Get all tours
  try {
    const features = new APIFeatures(Tour.find(), req.query) // EXECUTE QUERY
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).send({
      // Send the successful response with tours data
      message: 'success',
      status: 200,
      length: tours.length,
      data: { tours: tours },
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    next(new AppError('An error occurred while fetching tours', 500));
  }
};
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.createNewTour = catchAsync(async (req, res, next) => {           // Create a new tour
  const tourData = req.body;                       // Extract the tour data from the request body
  const newTour = await Tour.create(tourData);    // Create a new tour using the extracted data
  console.log('New Tour Created', newTour);       // Log the created tour for debugging purposes
  res.status(201).send({                    // Send a successful response with the created tour data
    message: 'Tour created successfully',
    status: 201,
    data: { tour: newTour },
  });
});

exports.findtours =  catchAsync( async (req, res,next) => {     // Get a specific tour by ID
        const tourId =req.params.id;
        const tours = await Tour.findById(tourId);      // Fetch all tours from the database

        res.status(200).send({      // Send the successful response with tours data
        message: 'success',
        status: 200,
        length: tours.length,
        data: { tours: tours },
    });
// } catch (error) {
//   next(new AppError('An error occurred while fetching Id', 500));
// }
});
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

exports.updateTour = async (req, res) => {    // Update a tour
  try {
    const tourId = req.params.id;
    const updatedTour = await Tour.findByIdAndUpdate(tourId, {
      name: 'Mangaluru',
      price: 10000,
      rating: 3,
    });

    if (!updatedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {         // Handle any errors that occur during the operation
    console.error('Error finding the id of tour:', error);

    res.status(500).send({                // Send an error response
      message: 'An error occurred while updating the tours',
      status: 500,
      error: error.message,
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const patchedTour = await Tour.findByIdAndUpdate(tourId, {
      name: 'US',
      price: 30000,
      rating: 3,
    });

    if (!patchedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: patchedTour,
      },
    });
  } catch (error) {
    console.error('Error finding the id of tour:', error);

    res.status(500).send({
      message: 'An error occurred while updating the tours',
      status: 500,
      error: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {            // Delete a tour
  try{
    const tourId = req.params.id;
    const deletedTour = await Tour.findOneAndDelete({ _id: tourId });
    console.log("Tour deleted");

    if (!deletedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!',
      });
    }

    res.status(201).json({
      message: 'Tour deleted successfully',
      status: 'success',
      data:null
    });
  }catch (error) {
      console.error("Error finding the id of tour:", error);
  
      res.status(500).send({
        message: 'An error occurred while deleting the tours',
        status: 500,
        error: error.message,
      });
    }
  };

  exports.getTourStats = async (req, res) => {      //aggregate function
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
        {
          $sort: { avgPrice: 1 },
        },
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          stats,
        },
      });
    } catch (error) {
      console.error('Error finding the id of tour:', error);

      res.status(500).send({
        message: 'An error occurred while deleting the tours',
        status: 500,
        error: error.message,
      });
    }
  };

    exports.getMonthlyPlan = async (req, res) => {
      try {
        const year = req.params.year*1;
        

        const Plans = await Tour.aggregate([
          {
            $unwind:'$startDates', 
          },{
            $match: {
            startDates:{
              $gte:new Date('2021-01-01'),
              $lte:new Date('2021-12-31')
            }
          }
        },
          {
            $group:{
              _id :{$month:'$startDates'},
              numToursStarts:{$sum:1},
              tours: { $push: '$name' }
            }
          },
          // {
          //   $project: {
          //     _id: 0
          //   }
          // },

          {
            $sort: { numTourStarts: 1 }
          },
                

          
        ]);
        res.status(200).json({
          status: 'success',
          length: Plans.length,
          data: {
            Plans
          }
        });

        

      }catch (error) {
        // Handle any errors that occur during the operation
          console.error("Error finding the year of tour:", error);
      
        // Send an error response
          res.status(500).send({
            message: 'An error occurred while fingding the tours year',
            status: 500,
            error: error.message,
          });
        }
      };
      exports.getImagesAndCovers = async (req, res) => {
        try {
          const images = await Tour.aggregate([
            {
              $project: {
                _id: 0,           // Exclude the _id field
                imageCover: 1,    // Include the imageCover field
                images: 1         // Include the images field
              }
            }
          ]);
      
          // Send the images data in the response
          res.status(200).json({
            status: 'success',
            data: {
              images
            }
          });
      
        } catch (err) {
          console.error('Error fetching tours:', err.message);
          res.status(500).json({
            status: 'error',
            message: 'Error fetching tours'
          });
        }
      };

     exports.getMaxGroupSize = async (req, res) => {
        try {
          const groupedTours = await Tour.aggregate([
            {
              $group: {
                _id: "$maxGroupSize", // Group by the maxGroupSize field
                numTours: { $sum: 1 } // Count the number of tours in each group
              }
            },
            {
              $sort: { _id: 1 } // Sort the results by maxGroupSize in ascending order
            }
          ]);
      
          res.status(200).json({
            status: 'success',
            data: {
              groupedTours
            }
          });
        } catch (err) {
          console.error('Error grouping tours by maxGroupSize:', err.message);
          res.status(500).json({
            status: 'error',
            message: 'Error grouping tours by maxGroupSize',
            error: err.message
          });
        }
      };
      // Define the function
      exports.getToursByYear = async (req, res) => {
        try {
          const toursByYear = await Tour.aggregate([
            {
              $unwind: "$startDates",
            },
            {
              $group: {
                _id: { year: { $year: "$startDates" }, name: { name: "$name" } },
                numTours: { $sum: 1 },
                tours: {
                  $addToSet: { name: "$name" }
                },
              },
            },
            {
              $addFields: { Year: '$_id', numToursPlan:'$numTours' }
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ]);
      
          res.status(200).json({
            status: "success",
            data: { toursByYear },
          });
        } catch (err) {
          console.error("Error grouping tours by year:", err.message);
          res.status(500).json({
            status: "error",
            message: "Error grouping tours by year",
            error: err.message,
          });
        }
      };

        
exports.getRatingsAverage = async (req, res) => {
  try{
    const getRatings = await Tour.aggregate([
      { $group: { 
        _id :'$ratingsAverage', 
        numTours: { $sum: 1 }, // Count the number of tours in each category
        averageRating: { $avg: "$ratingsAverage" },
        minRating: { $min: "$ratingsAverage" }, // Minimum rating in each category
        maxRating: { $max: "$ratingsAverage" }, // Maximum rating in each category
        tours: { $push: '$name' } 
        } 
      },
      {
        $project:
        {
          _id: 0,
          name: 1 
        }
      },
      {
        // Debugging: Show the results after grouping
        $sort: { "_id": 1 }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: { getRatings }
    });
  
  }catch (err) {
    console.error('Error getting toursAverage:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error getting toursAverage',
      error: err.message
    });
  }
};


    