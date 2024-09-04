const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`./tours-simple.json`, 'utf-8'));

exports.checkId =(req,res,next,val)=>{
  const Id = req.params.id * 1;
  const choseTour = tours.find((el) => el.id === Id);
  if (!choseTour) {
    res.status(200).send({ message: 'not found !!!', status: 204 });
  }
  next();
}

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;

  // Check if both name and price are present in the request body
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price in request body!',
    });
  }
  // If both name and price are present, proceed to the next middleware
  next();
};

//functions
exports.getAllTours = (req, res) => {
  res.status(200).send({
    message: 'success',
    status: 200,
    length: tours.length,
    data: { tours: tours },
  });
};
exports.CreatenewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(tours)
  );
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
};

exports.findtours = (req, res) => {
  const Id = req.params.id * 1;
  const choseTour = tours.find((el) => el.id === Id);
    res.status(200).send({
      message: 'success',
      status: 200,
      length: tours.length,
      data: { tours: choseTour },
    });
  
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
