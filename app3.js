const express = require('express');
var bodyParser = require('body-parser').json();
const app = express();
const port = 3000;
const cors = require("cors");
// This is required to handle urlencoded data
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
// This to handle json data coming from requests mainly post
app.use(cors("*")) // This Cross Origin Handling
app.post('/api/data', (req, res) => {
	// Handle the POST request here
	const data = req.body;
	// Send a response back to the client
	res.status(200).json(
	{ data: data, message: 'Data received successfully' });
});
app.post('/api/content', (req, res) => {
	// Handle the POST request here
	const {name,email,age} = req.body;
	data = {name:name,email:email,age:age};
	// Send a response back to the client
	res.status(200).json(
	{ data: data, message: 'Data received successfully' });
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.post('/itemSearch', bodyParser, function(req, res) {
    //var Keywords = req.body.Keywords;
    console.log("Yoooooo");
    console.log(req.headers);
    console.log(req.body);
    res.status(200).send("yay");
  });