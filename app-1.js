const express = require('express');
const fs = require('fs');



const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const app = express();

//to add or remove or update data
app.use(express.json());
app.use((req,res,next)=>{
  console.log("Here I am calling middleware");
  
  next();
})
app.use((req,res,next)=>{
  console.log("Here I am calling middleware2");
  
  next();
})
const port = 3000;
app.listen(port, () => {
  console.log(`hello I am Listening to the port number ${port}`);
});

app.get('/', (req, res) => {
  res.status(200).send({ message: 'hello from the message ', number: '1' });
});

app.post('/', (req, res) => {
  res.status(200).send({ message: 'hello from the message ', number: '1' });
});

app.get('/app/v1/tours', (req, res) => {
  res
    .status(200)
    .send({
      message: 'success',
      status: 200,
      length: tours.length,
      data: { tours: tours },
    });
});

//finding a tour
app.get('/app/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((p) => p.id == id);
  if (!tour) {
 
    res.status(200).send({ message: 'not found !!!', status: 204 });
  } else {
    res
      .status(200)
      .send({ message: 'success', status: 200, data: { tours: tour } });
  }
});

app.post('/app/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  console.log(newTour);
  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(newTour),
    (err) => {
      res.status(200).send({ message: "successfully added"});
    }
  );


});

app.post('/tours',(req,res)  => {


    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id:newId},req.body);
    console.log(newTour);
});
