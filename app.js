const express = require('express');
const bodyParser = require('body-parser');
// cross origin resource sharing
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();
const nodemailMailgun = require('nodemailer-mailgun-transport');

// Step 1

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};

// Step 2 - Transporter
let transporter = nodemailer.createTransport(nodemailMailgun(auth));

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
  res.send('API Status: Running')
})

// Step 3 - define post route
app.post('/new', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message

  const mail = {
    from: email,
    to: 'hiboabdilaahi@gmail.com',
    subject: 'Contact form request',
    html: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }

// sendMail delivers the message object using the transporter made above
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
    transporter.close();
  })
})

//listen on port 3030 on local host
app.listen(process.env.PORT || 5000, '0.0.0.0');
