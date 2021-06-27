require('dotenv').config();
var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var Cart = require('../models/cart');
var Order = require('../models/order');

var Qmenu = require('../models/qMenu'); 
var Smenu = require('../models/sMenu'); 

/* GET home page. */
router.get('/', function (req, res, next) {
  var sMenuChunks = [];
  var qMenuChunks = [];
  Qmenu.find(function (err, docs) {
    if (err) {
     console.log(err)
   }
    var chunkSize = 3
   for (var i = 0; i < docs.length; i += chunkSize) {
     qMenuChunks.push(docs.slice(i, i + chunkSize))
   }
    console.log(sMenuChunks)
  });
  Smenu.find(function (err, docs) {
    if (err) {
     console.log(err)
   }
    var chunkSize = 3
    for (var i = 0; i < docs.length; i += chunkSize) {
     sMenuChunks.push(docs.slice(i, i + chunkSize))
   }
  
    });
  
 if (req.isAuthenticated()) {
    var firstName = req.user.fname;
    var lastName = req.user.lname;
    var userImage = req.user.userImage
  return res.render('index', { title: 'WEBUYNDCOOK', firstName: firstName, lastName: lastName,userImage:userImage, smenus: sMenuChunks,qmenus: qMenuChunks })
  }
  return res.redirect('/user/signin');

  
  });

router.get('/addqmenu-to-cart/:id', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var user = req.session.user;
  var MenuId = req.params.id;
    Qmenu.findById(MenuId, function (err, Menu) {
    if (err) {
      return res.redirect('/')
    };
    cart.add(Menu, Menu.id);
         req.session.cart = cart;
         return res.redirect('/#menu');
    });

  
});
  
router.get('/addsmenu-to-cart/:id', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var user = req.session.user;
  var MenuId = req.params.id;
    Smenu.findById(MenuId, function (err, Menu) {
    if (err) {
      return res.redirect('/')
    };
    cart.add(Menu, Menu.id);
         req.session.cart = cart;
         return res.redirect('/#menu');
    });

  
});
  
router.get('/addfmenu-to-cart/:id', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var user = req.session.user;
  var MenuId = req.params.id;
    Smenu.findById(MenuId, function (err, Menu) {
    if (err) {
      return res.redirect('/')
    };
    cart.add(Menu, Menu.id);
         req.session.cart = cart;
         return res.redirect('/');
    });

  
});
  

router.get('/reduce/:id', function (req, res, next) {
  var MenuId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(MenuId);
  req.session.cart = cart;
  res.redirect('/profile/cart')
});


router.get('/remove/:id', function (req, res, next) {
  var MenuId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(MenuId);
  req.session.cart = cart;
  res.redirect('/profile/cart')
});


router.get('/shop/checkout',isLoggedin, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/profile/cart')
  };
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg})
});

router.post('/subscribe', isLoggedin, function (req, res, next) {
  var email = req.body.email
  var emailMessage = `Hi ${req.user.fname},\n\nThank you for subscribing to our mail, We will update you on our menu on Your email  ${email}.\n.`;
  console.log(emailMessage);

  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASSWORD
    }, tls: {
        rejectUnauthorized: false
    }
  });

  var emailOptions = {
    from: 'WebuyNdCook@gmail.com',
    to: email,
    cc: 'opeyemifolajimi13@gmail.com',
    subject: 'WebuyNdCook Cares',
    text : '\n\nThank you for subscribing to our mail,  here we are interested to give you the best meal offer at a very cheap price and if you stay long with us by patronising us often, you can stand the chance to eat free or even at discounted price. Slide in to our website @ www.webuyandcook.com to get even more',
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

router.post('/enquiry', isLoggedin, function (req, res, next) {
  var email = req.body.email
  var enquiry = req.body.enquiry

  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASSWORD
    }, tls: {
        rejectUnauthorized: false
    }
  });
  

  var emailOptions = {
    from: 'WebuyNdCook@gmail.com',
    to: email,
    cc: 'opeyemifolajimi13@gmail.com',
    subject: 'WebuyNdCook Cares',
    text : `Hi ${req.user.fname},\n\n WebuyNdcook Team apologize for any inconveniences you might have been through,\n The enquiry we got from you was  ${enquiry} and We will respond to  you via your email ( ${email}).\n.`,
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

router.post('/checkout', isLoggedin, function (req, res, next) {
  res.redirect('/shop/checkout')
});

router.get('/profile/cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/cart',{title:'My Cart', qMenus: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cart', {title:'My Cart',qmenus:cart.generateArray(),smenus:cart.generateArray(), totalPrice: cart.totalPrice})
})
module.exports = router;


function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin');
}