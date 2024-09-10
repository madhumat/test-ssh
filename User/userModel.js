const mongoose = require("mongoose");
const validator = require('validator');

const DB = 'mongodb://127.0.0.1:27017'
mongoose.connect(DB).then(
    () => { 
      console.log("connected to the Mongodb")
    },
    err => { 
      console.log("Not able to connect to the Mongodb error is :",err);
    }
  );
  // Define the schema for a user
  var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength:[6,"hello please maintain atleat 6 letters"]
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        //validate: [validator.confirmPassword===this.password, 'password is not matching']

    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;