const User = require('../userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

  const catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };

  const signToken = (id) => {
    return jwt.sign({ id }, '12', {
      expiresIn: '1h',
    });
  };

  exports.signup = catchAsync(async (req, res, next) => {
    const {name,emailId,password,confirmPassword} =req.body;

    const newUser = await User.create({
      name: name,
      emailId: emailId,
      password: password,
      confirmPassword: confirmPassword
    });

  const token= signToken(newUser._id);
   
    res.status(200).json({
      status: 'success',
      token,
      data: {
        newUser
    }
  });
  });
  // Login Function
  exports.login = catchAsync(async (req, res, next) => {
    const { emailId, password } = req.body;

    if (!emailId || !password) {          // 1. Checks if email and password exist
      return res.status(400).json({
        status: 'fail',
        message: 'Please, provide email and password',
      });
    }

    const user = await User.findOne({ emailId }).select('+password');     // 2. Check if the user exists and if the password is correct
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);      // 3. Compare password with the hashed password in the database
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password',
      });
    }

    const token = signToken(user._id);        // 4. If everything is correct, send the token

    res.status(200).json({
      status: 'success',
      token,
    });
  });
  exports.tempPassword = async(req,res) =>
  {
    const {emailId} = req.body;

    const user = await User.findOne({ emailId });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User with this emailId does not exist',
    });
  }
    const temp = "abcd";

    user.temp = temp; //saving to database for validation


    res.status(200).json({
      status: 'success',
      message: 'Temporary password generated',
      temp                           // Returning the temporary password
    });
  };
  exports.resetPassword = async(req, res)=>
  {
    const { emailId, temp, password, confirmPassword } = req.body;
    console.log(emailId);
    const user = await User.findOne({ emailId }).select('+password'); 

    console.log("User ------",user);
   // const user = await User.findOne({'emailId':emailId });
    if(!user)
      return res.status(404).json({
        status: 'fail',
        message: 'User with this email does not exist',
      });
    
    if(user.temp !== temp)
    {
      return res.status(400).json({
        status: 'fail',
        message: 'Incorrect temporary password',
      });
    }
  

   
const updatedPassword =  await user.save({password});

console.log("updatedPassword ==",updatedPassword);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
  });


  }