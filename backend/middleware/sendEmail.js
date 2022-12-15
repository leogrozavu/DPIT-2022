const mongoose = require('mongoose')
const express = require('express')
const router  = express.Router()
const nodemailer = require('nodemailer')

module.exports = (email, link) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'cybercyan78@gmail.com',
          pass: 'oamwtctwhknvnczv',
        },
        from: 'cybercyan78@gmail.com',
        });
      
      
      const mailOptions = {
        from: 'cybercyan78@gmail.com',
        to: email,
        subject: 'Password recovery',
        text: `Your recovery link is ${link}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}