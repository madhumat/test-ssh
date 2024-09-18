
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRoute =require('./route/tourRoute');
const globalHandlers = require('./controller/errorController');
const userRoute = require('./User/route/userRoute');
const authRoute = require('./User/route/authRoute');

console.log(process.env.NODE_ENV);
// if(process.env.NODE_ENV.trim() === 'dev' ){
// app.use(morgan('dev'));
// }



app.use(express.json()); // To parse JSON request bodies
app.use('/app/v1/tours', tourRoute);
app.use('/app/v1/users',userRoute);
app.use('/app/v1/users',authRoute);

app.use(express.static(`${__dirname}`));

// app.all("*",(req,res,next)=>{
//     res.status(404).json({
//       status:"fail",
//       message:`the error in fetching the requested URL ${req.originalUrl} on the server`
//     })
//     next();
// });

app.all("*",(req,res,next)=>{
    const err = new Error(`the error in fetching the requested URL ${req.originalUrl} on the server`);
    err.statusCode =404;
    err.status = 'fail';
    next(err);
});

app.use(globalHandlers);


module.exports=app;


