const express = require('express');
const bodyParser = require('body-parser');
// cross origin resource sharing
const cors = require('cors');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config()
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
     process.env.CLIENT_ID, // ClientID
     process.env.CLIENT_SECRET, // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);

//using the refresh token to request a new accesstoken
oauth2Client.setCredentials({
     refresh_token: process.env.REFRESH_TOKEN
});

//passing the credentials in the config file (.env) to the SMTP transporter
  oauth2Client.getAccessToken().then(result => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        refresh_token: process.env.REFRESH_TOKEN,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        accessToken: result.token,
      }
    })

  // confirming the SMTP connection is correct using the verify method
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  })


  // defining the post route inside the .then function as the transporter object
  // is not accessible outside of the .then function
  app.post('/new', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const message = req.body.message

    var mail = {
      from: email,
      to: process.env.PERSONAL_EMAIL,
      subject: 'Contact form request',
      html: message
    }

  // sendMail delivers the message object using the transporter made above
    transporter.sendMail(mail, (err, data) => {
      if(err){
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
})

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

//listen on port 3030 on local host
app.listen(process.env.PORT || 5000, '0.0.0.0');
