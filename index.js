const express = require("express");
const app = express();
const http = require('http').Server(app)
const bodyParser= require('body-parser');

const hostname = '127.0.0.1';
const port = 3001;


// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the default API route',
}));

http.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const Role = require("./models").Role
Role.create({
  name: "President"
})
  .then(role => console.log(role))
  .catch(err => console.log(err));