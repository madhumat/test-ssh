# test-ssh
There is another one SSH
hello I am madhumati
1111    


_____________________________________________________________________________________________
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;



_________________________________________________________________________________
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};




    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;


______________________________________________________________________________



exports.getTourStats = async(req,res)=>{
    try{
        const stats = await Tour.aggreagate([
            {
                $match:{ratingsAverage:{ $gte:4.5}}
            },
            {
                $group:{
                    _id:null,
                    //_id:'$difficulty' // what we want to group by 
                    avgrating:{$avg:'$ratingsAverage'},
                    avgPrice:{$avg:'$price'},
                }
            }
        ])
    }catch{

    }


}


________________________________________________


Get monthly plan for $unwind , Date and  $match ,$group an agrregate 


 const year = req.params.year *1 ;
       const plan = await Tour.aggregate([
        {
          // deconstruct input  
          $unwind:'$startDates'
        },
        {
          $match:{
            startDates:{
              $gte: new Date(`"${year}-01-01"`),
              $lte: new Date(`"${year}-12-31"`),
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
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: { numTourStarts: -1 }
        },
        {
          $limit: 12
        }
       ])

_________________________________________________________________________________________________________________

Data Model -virtual properties 

* we can only add this property inside our API 
* we can not query these value using find () 


tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

In scheama :

  {
    toJSON:{virtuals:true},
    toOBJECT:{virtuals:true}
  }



---------------------------------------------------------------------------------------------------------------------------

Document middle ware 

4 types of middle ware in mongoose 
1. document  = runs before .save() and .create()
2. Query 
3. Aggregate 
4. Modal middle ware 

1. Document 
  .pre 
_________
 tourSchema.pre('save', function(){
    console.log(this);
  });

  {

   tourSchema.pre('save', function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
  });


  Post 
  ____________
  
    tourSchema.post('save', function(doc, next){
    console.log(doc)
    next();
  });


  Querry Middle ware 
  __________________

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});


Aggregate middle ware  -> should be used in .aggregate function and please use it in .stats

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});



______________________________________________________________________________________________________________________

Data Validation , sanitization  

* we use the validation 
eg : data validator built in , required , unique (its not validator)

/// BUILT-IN Validators

1. strings:
maxlenth:[40,'tour must have less or qual to 40 Characters'],
minLenth: 

test  for below senarios 
. create tour
. Update Tour => run Validators 

2. this is for Numbers 
min 
max

test for below 
 . for rating to update 

3. Enum  -> use it for only strings
 enum :{
  values:[],
  message:''
 }

 test for example : 

 in difficulty 

//CUSTOM  Validators 

1. Adding validate 
priceDiscount :{
  type:Number
  validate: function (val){
      return val< this.price
  }
}


2. Adding custom message with Validator.
priceDiscount :{
 type:Number
 validate: {
  validator: function (val){
    // this only points to the current document on new document creation , this will not work on update documentation 
      return val< this.price
  },
  message:'The value must have the discount ({VALUE} )'  
}
}

3. check for custom validator -> validator in github 
   https://github.com/validatorjs/validator.js

   validate  works only strings 

   validate: validator.isAlpha,
   validate:[validator.isAlpha, 'validate only Alpha ']



________________________________________________________________________________________________________________________________________

Error handling strategy 

1. to install Debuuger tool 

"debug":"ndb server.js" -> downloads chromium 


__________________________________________________________________________________________________________________________________

Handling Rote handlers error

app.all("*",(req,res,next)=>{
  retuss.status(404).json({
    status:"fail",
    message:`the error in fetching the requested URL ${req.originalUrl} on the server`
  })
})


_____________________________________________________________________________________________________________________________

Error Handling 

OPerational errors:

Problems that we can predict for , it might happen at some point 
. Invalid Path 
.Wrong user input 
faild to connect to the server 
. failed to connected to the DB

Programming Errors:

. Sometimes getting an undefined values 
. passing a string when number is expected 
. using await instead of async 
. using req.param instead req.query

Global Error Handling middle ware 

app.use((err,req,res,next)=>{
err.statusCode =err.statusCode || 500;
err.status = err.status || 'error';

res.status(err.statusCode).json({
  status = err.status,
  message = err.message
})
})



Handling the errors by thwing into the error handler in to get the middle ware  : next (err);
-----------------------------------------------
app.use((err,req,res,next)=>{
const err = new Error(`the error in fetching the requested URL ${req.originalUrl} on the server`);
err.statusCode =404;
err.status = 'fail';
next(err);
})


Global Handler with the class 
-----------------------------

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

/**if its an operational error:*/
next(new AppError('No tour found with that ID', 404));


Error Controller with class -> globalErrorHandler -> errorController.js
-------------------------------------------------


module.exports = (err,req,res,next)=>{
err.statusCode =err.statusCode || 500;
err.status = err.status || 'error';

res.status(err.statusCode).json({
  status = err.status,
  message = err.message
});
}

app.use(globalHandlers);


Catching async errors 
---------------------
1. remove try catch block from the code 
2. add the fn (function) to the block

const catchAsync = fn =>{
  fn(req,res,next).catch(err=>next(err))
}

exports.createNewTour = catchAsync( async (req, res next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).send({
      message: "Tour created successfully",
      status: 201,
      data: { tour: newTour },
    });
});

\\\\*** to make express understand the req, res  **\

const catchAsync = fn =>{
  return (req,res,next)=> {
  fn(req,res,next).catch(next)
  }
}

\** module exports in utils **\

module.exports = fn =>{
  return (req,res,next)=> {
  fn(req,res,next).catch(next)
  }
}





















 



