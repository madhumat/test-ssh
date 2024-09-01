
const mongoose = require("mongoose");

const DB = 'mongodb://127.0.0.1:27017'
mongoose.connect(DB).then(
    () => { 
      console.log("connected to the Mongodb")
    },
    err => { 
      console.log("Not able to connect to the Mongodb error is :",err);
    }
  );
  var tourSchema = new mongoose.Schema({
    "name":{
      "type":String,
      "require":[true,"Name field is required"],
      "unique":true
    },
    "price":Number,
    "rating":{
      "type":Number,
      "require":true
    }
  })
  
  const Tour = mongoose.model('Tour', tourSchema);
  module.exports =Tour;

  