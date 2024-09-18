const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");


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
        validate: {
          /** This only works on CREATE and SAVE!!!*/
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }

    },
    temp: {
      type: String
    }
});
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
   next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;