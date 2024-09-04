
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRoute =require('./route/tourRoute');

console.log(process.env.NODE_ENV);
// if(process.env.NODE_ENV.trim() === 'dev' ){
// app.use(morgan('dev'));
// }

app.use(express.json()); // To parse JSON request bodies
app.use('/app/v1/tours', tourRoute);
app.use(express.static(`${__dirname}`))

module.exports=app;


