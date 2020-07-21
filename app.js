const express = require('express');
const bodyParser = require('body-parser');
// cross origin resource sharing
const cors = require('cors');

const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res, next) => {
  res.send('API Staus: Running')
})

//listen on port 3030 on local host
app.listen(3030, '0.0.0.0');
