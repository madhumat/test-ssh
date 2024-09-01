const express = require('express');
const app = express();
const fs = require('fs');

var userRoute = express.Router();
app.use('/app/v1/users',userRoute);
//route handlers
userRoute.route('/')
.get(getAllusers)
.post(Createnewuser);

userRoute.route('/:id')
.get(findusers)
.post(Deleteuser);

//functions
var getAllusers = (req, res) => {
    console.log('hello from route/');
    res.status(200).send({ message: 'hello', number: '1' });
  };
  
  var Createnewuser = (req, res) => {
    console.log('you can send anything in the post here /');
    res.send('you can send anything in the post here');
  };
  
  var findusers = (req, res) => {
    console.log('you can send anything in the post here /');
    res.send('you can send anything in the post here');
  };
  var Deleteuser = (req, res) => {
    console.log('you can send anything in the post here /');
    res.send('you can send anything in the post here');
  };