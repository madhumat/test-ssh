
const mongoose = require("mongoose");
const slugify = require("slugify");

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
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
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
        required: [true, 'A tour must have a difficulty'],
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        required: [true, 'A tour must have a price']
      },
      priceDiscount: {
        type: Number,
  
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

  