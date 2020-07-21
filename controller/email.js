const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config()

// passing the credentials in the config file (.env) to the SMTP transport
var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}

var transporter = nodemailer.createTransport(transport)

// confirming the SMTP connection is correct using the verify method
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

// Controller
var EmailController = {
  // starts by creating the email object (object is called mail)
  Send: function(req, res){
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
    })
  }
};

module.exports = EmailController;
