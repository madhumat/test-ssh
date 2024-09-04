
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator")

const DB = 'mongodb://127.0.0.1:27017'
mongoose.connect(DB).then(
    () => { 
      console.log("connected to the Mongodb")
    },
    err => { 
      console.log("Not able to connect to the Mongodb error is :",err);
    }
  );
  // Define the schema for a tour
  var tourSchema = new mongoose.Schema({
  
      name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlenth:[40,"hello this should be of max length 40"],
        minlength:[10,"hello please maintain atleat 10 letter"],
        validate: [validator.isAlpha, 'Tour name must only contain characters']
      },
      slug:String,
      duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
      },
      difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'], // "easy", "medium" , "difficult" 
        enum :{
          values:["easy", "medium" , "difficult"],
          message:'the above values only should be error '
         }
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
        min:2,
        max:5
      },
      ratingsQuantity: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        required: [true, 'A tour must have a price']
      },
      priceDiscount: {
        type: Number,
        validate:{
          validator: function (val){
             // this only points to the current document on new document creation , this will not work on update documentation 
            return val< this.price
        },
          message:`the price value should be greater than Discount price ({VALUE} )`
        }
        
       
      },
      summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
      },
      description: {
        type: String,
        trim: true
      },
      secretTour: {
        type: Boolean,
        default: false
      },
      imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      startDates: [Date],
   
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }

)

  tourSchema.virtual('durationInWeeks').get( function() {
     return this.duration / 7; 
    });

    // tourSchema.pre('save', function(){
    //   console.log(this);
    // });
    tourSchema.pre('save', function(next){
      console.log("Saving continued... ");
      next();
    });

    // tourSchema.pre('save', function(next){
    //   this.slug = slugify(this.name,{lower:true});
    //   next();
    // });
  

    tourSchema.post('save', function(doc, next){
      console.log("DOccccc",doc)
      next();
    });

    tourSchema.pre(/^find/, function(next) {
      this.find({ secretTour: { $ne: true } });
     // this.start = Date.now();
      next();
    });
  // Create a model
  const Tour = mongoose.model('Tour', tourSchema);
  module.exports =Tour;

  