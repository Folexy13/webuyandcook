require('dotenv').config();
var mailer = require('nodemailer');

//  Creating the mail transport
var mailTransport = mailer.createTransport({
    service: "gmail",
    auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASSWORD
    }, tls: {
        rejectUnauthorized: false
    }
});

// Creating the mail Option

var mailOption = {
    from: 'folajimiopeyemisax13@gmail.com',
    to: 'opeyemifolajimi13@gmail.com',
    subject: 'Just for testing purpose',
    text : 'Welcome to webyNdcook,  here we are interested to give you the bbest meal offer at a very cheap price and even if you stay long with us by patronising us often, you can stand the chance to eat free or even at discounted price. slide in to our website to get even more',
}

// Callback for sending the mail

mailTransport.sendMail(mailOption, function (err, info) {
    if (err) {
        console.log(err)
    } else {
        console.log(info)
    }
});