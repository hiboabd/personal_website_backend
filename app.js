const express = require('express');
const bodyParser = require('body-parser');
// cross origin resource sharing
const cors = require('cors');

const nodemailer = require("nodemailer");

const dotenv = require('dotenv').config()

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

app.get('/', (req, res, next) => {
  res.send('API Staus: Running')
})

app.post('/new', (req, res, next) => {
  console.log(req)
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message

  var mail = {
    from: email,
    to: process.env.PERSONAL_EMAIL,
    subject: 'Contact form request',

    html: message
  }

  transporter.sendMail(mail, (err, data) => {
    if(err){
      console.log(err)
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

//listen on port 3030 on local host
app.listen(3030, '0.0.0.0');
