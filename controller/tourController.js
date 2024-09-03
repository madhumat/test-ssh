
 const { query } = require("express");
const Tour = require("./../model/tourModel"); //JSON.parse(fs.readFileSync(`./tours-simple.json`, 'utf-8'));
const APIFeatures = require('./../utils/apiFeatures');


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//functions
// Get all tours
exports.getAllTours = async (req, res) => {
    try {
        // Fetch all tours from the database

      //   console.log("get All tours -querry params : ",req.query );

        
        
        /** Filtering */
        // var queryParam = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`);

        // console.log(" query replced regex : ", queryParam);
        //const tours = await Tour.find(JSON.parse(queryParam));
//----------------------------------------------------------------------------------------------------------------------------------------------

      /**** Sort example
      const queryString = JSON.stringify(req.query.sort).split(',').join(" ");

      const parsedQuery= JSON.parse(queryString);

      const tours = await Tour.find().sort(parsedQuery); 
      
      **/

    // ---------------------------------------------------------------------------------------------------------------------------------------------  

      /******* field example *****

      queryString = JSON.stringify(req.query.fields).split(',').join(" ");
      const parsedQuery= JSON.parse(queryString);
      const tours = await Tour.find().select(parsedQuery);**/
        
    //----------------------------------------------------------------------------------------------------------------------------------------------

    /**************  Pagination  *************/
      
    //  var page = req.query.page*1;
    //  var limited = req.query.limit*1;
    //  console.log("page  limited ",page );
    //  const tours = await Tour.find().skip(page-1).limit(limited);
        


        // Log the tours for debugging purposes
       // console.log("Tours", req.query);


      
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
          .filter()
          .sort()
          .limitFields()
          .paginate();
        const tours = await features.query;

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

// Create a new tour
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

// Get a specific tour by ID
exports.findtours = async (req, res) => {
    try {

        const tourId =req.params.id;

        console.log(tourId);
        // Fetch all tours from the database
        //const tours = await Tour.find({"_id":tourId});
        
        const tours = await Tour.findById(tourId);



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

// Update a tour
exports.updateTour = async (req, res) => {
  try{
    const tourId = req.params.id;
  //const tourIndex = tours.findById((el) => el._id === Id);
    //const tour_id = '66c99bfb180a78977da7fe2e';
    const updatedTour = await Tour.findByIdAndUpdate(tourId, { name: 'Mangaluru',price:10000, rating:3 }
                            
    );

    if (!updatedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  }catch (error) {
  // Handle any errors that occur during the operation
    console.error("Error finding the id of tour:", error);

  // Send an error response
    res.status(500).send({
      message: 'An error occurred while updating the tours',
      status: 500,
      error: error.message,
    });
  }
};


exports.patchTour = async (req, res) => {
  try{
    const tourId = req.params.id;
    const patchedTour = await Tour.findByIdAndUpdate(tourId, { name: 'US',price:30000, rating:3 });

    if (!patchedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: patchedTour
      }
    });
  }catch (error) {
    // Handle any errors that occur during the operation
      console.error("Error finding the id of tour:", error);
  
    // Send an error response
      res.status(500).send({
        message: 'An error occurred while updating the tours',
        status: 500,
        error: error.message,
      });
    }
  };

// Delete a tour
exports.deleteTour = async (req, res) => {
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
    // Handle any errors that occur during the operation
      console.error("Error finding the id of tour:", error);
  
    // Send an error response
      res.status(500).send({
        message: 'An error occurred while deleting the tours',
        status: 500,
        error: error.message,
      });
    }
  };

  //aggregate function
  exports.getTourStats = async (req, res) => {
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
        }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
    }catch (error) {
      // Handle any errors that occur during the operation
        console.error("Error finding the id of tour:", error);
    
      // Send an error response
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
        console.log(year);

        const Plans = await Tour.aggregate([
          {
            $unwind:'$startDates', 
          },{
            $match: {
            startDates:{
              $gte:new Date(`'${year}-01-01'`),
              $lte:new Date(`'${year}-12-31'`)
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
          {
            $limit: 12
          }
         

          
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
         $unwind: '$startDates'
      },
      { $group: { 
        _id :{$year:'$startDates'}, 
        numTours: { $sum: 1 }, 
        tours: { $push: '$name' } 
        } 
      },
      {
        $project: {
          _id: 0,           // Exclude the _id field
          startDates:1,    // Include the imageCover field
          name: 1         // Include the images field
        }
      },
      { $sort: { 
        _id: 1 } 
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { toursByYear }
    });

  } catch (err) {
    console.error('Error grouping tours by year:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error grouping tours by year',
      error: err.message
    });
  }
};
