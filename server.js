// Server code
const port = 3000;
const app = require('./app');


//console.log(process.env);
app.listen(port, () => {
  console.log(`Hello, I am listening on port number ${port}`);
});

console.log("hello");