const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config()

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

var EmailController = {
  Send: function(req, res){
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

  }
};

module.exports = EmailController;
