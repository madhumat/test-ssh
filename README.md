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




