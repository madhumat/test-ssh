var bodyParser = require('body-parser');
const express = require('express');
const app = express();
// app.use(bodyParser.urlencoded({extended : false}));
// app.use(bodyParser.json());
// const express = require("express")

const fs = require('fs');
const morgan = require('morgan');

app.use(express.json());
app.use((req, res, next) => {
  console.log('Here I am calling middleware');

  next();
});
app.use(morgan('tiny'));
app.use((req, res, next) => {
    req.requstedTime = new Date().toISOString();
  console.log('Here I am calling middleware2');

  next();
});
//app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.listen(port, () => {
  console.log(`hello I am listening to the port number ${port} `);
});

app.get('/', (req, res) => {
  console.log('hello from route/');

  //res.send("hello from server side");

  res.status(200).send({
    requsted: req.requstedTime,
    message: 'hello',
      number: '1' });
});
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
  );

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

app.post('/', (req, res) => {
  console.log('you can send anything in the post here /');

  res.send('you can send anything in the post here');

  // res.status(200).send({message:"hello", number:'1'});
});

// READ JSON FILE

app.post('/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  console.log(req.body);
  const newTour = Object.assign({ id: newId }, req.body);
  console.log(newTour);
  tours.push(newTour);
  //     tours.push(newTour)

  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.json({ data: { tour: newTour } });
    }
  );

  //     //res.send("hello from server side");

  res.status(200).send({ message: tours });
});

app.post('/app/v1', (req, res) => {
  const newId = req.params.id * 1;
  const newTour = tours.find((el) => el.id === id); /*** changes needs to be done  */
  //console.log(tour);
  tours.push(newTour);

  fs.writeFileSync(
    `${__dirname}/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.json({ data: { tour: newTour } });
    }
  );
});
