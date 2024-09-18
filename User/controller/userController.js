const User = require('../userModel');

//functions
exports.createUser = async (req, res) =>{               //create a new user
    try{
        const newUser = await User.create(req.body);

        res.status(201).json({      //success response
            status: 'success',
            data: {
              user: newUser,
            },
          });
    }catch(err) {
        res.status(400).json({
          status: 'fail',
          message: err.message,
        });
      }
};

exports.getAllUsers = async (req, res) => {     // Get all users
    try {
      const users = await User.find()         // Fetch all users from the database
      .select('id name emailId')           // Include only id, name, and emailId
      .select('-__v -confirmPassword');      // Exclude __v and confirmPassword

  
      res.status(200).json({            // Send success response
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
  };
  
