require('dotenv').config();
var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var Cart = require('../models/cart');
var Order = require('../models/order');
var async = require('async');
var multer = require('multer');
var User = require('../models/user');
var Qmenu = require('../models/qMenu'); 
var Smenu = require('../models/sMenu'); 


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null,new Date().toISOString().replace(/:/g, '-')+ file.originalname)
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1
  },
  fileFilter:fileFilter
})
var fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept a file
    cb(null, true)
  } else {
    //  reject a file
    cb(null, false)
  }
  
 }

/* GET home page. */
router.get('/', function (req, res, next) {
 var successMsg = req.flash('success');
 var sMenuChunks = [];
 var qMenuChunks = [];
  
  async.waterfall([
    function (done) {
      Qmenu.find(function (err, docs) {
      if (err) {
      return done (null,err,false);
     }
        var chunkSize = 3
    for (var i = 0; i < docs.length; i += chunkSize) {
      qMenuChunks.push(docs.slice(i, i + chunkSize))
    }
      done()
      });
      
  },
    function (done) {
    Smenu.find(function (err, docs) {
      if (err) {
      return done (null,err,false);
     }
    var chunkSize = 3
    for (var i = 0; i < docs.length; i += chunkSize) {
      sMenuChunks.push(docs.slice(i, i + chunkSize))
      }
      done()
    });
    }
  ], function (err) {
    if (err) return next(err)
    if (req.isAuthenticated()) {
    var firstName = req.user.fname;
    var lastName = req.user.lname;
    var userImage = req.user.userImage
     return res.render('index', {
     title: 'WEBUYNDCOOK',
     firstName: firstName,
     lastName: lastName,
     userImage: userImage,
     smenus: sMenuChunks,
     qmenus: qMenuChunks,
     successMsg: successMsg,
     success: successMsg.length > 0
   })
    }
  return res.render('index', {title: 'WEBUYNDCOOK',smenus: sMenuChunks,qmenus: qMenuChunks});
  });
  
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
  res.render('shop/checkout', {title:'Procced to payment',total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg})
});

router.post('/subscribe', isLoggedin, function (req, res, next) {
  var email = req.body.email

  var transporter = nodemailer.createTransport({
    service: "GMAIL",
    port: 465,
    secure:true,
    auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASSWORD
    }, tls: {
        rejectUnauthorized: false
    }
  });
  let from = `Admin@Webuyandcook<folajimiopeyemisax13@gmail.com>`
  var emailOptions = {
    from: from,
    to: email,
    cc: 'opeyemifolajimi13@gmail.com',
    subject: 'WebuyNdCook Cares',
    text : '\n\nThank you for subscribing to our mail,  here we are interested to give you the best meal offer at a very cheap price and if you stay long with us by patronising us often, you can stand the chance to eat free or even at discounted price. Slide in to our website @ www.webuyandcook.com to get even more\n\n Thanks\n WebuyNdCook Team',
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

router.post('/change-picture', isLoggedin, upload.single('userImage'), function (req, res, next) {
  User.findOne({_id:req.user._id}, function (err, user) {
    User.findByIdAndUpdate({ _id: user._id }, { userImage: req.file.path }, { new: true }, function (err, user) {
      if (err) console.log('failed')
      user.save(function (err) {
        if (err) console.log(err)
        res.redirect('/user/profile')
      })
    })
  })
});
router.post('/enquiry', isLoggedin, function (req, res, next) {
  var email = req.body.email
  var enquiry = req.body.enquiry
  var firstname = req.user.fname
  var transporter = nodemailer.createTransport({
    service: "GMAIL",
    port: 465,
    secure:true,
    auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASSWORD
    }, tls: {
        rejectUnauthorized: false
    }
  });
  let from = `Admin@Webuyandcook<folajimiopeyemisax13@gmail.com>`
  var emailOptions = {
    from: from,
    to: email,
    cc: 'opeyemifolajimi13@gmail.com',
    subject: 'WebuyNdCook Cares',
    text : `Hi ${firstname},\n\n WebuyNdcook Team apologize for any inconveniences you might have been through.\n\n The enquiry/complain we got from you was " ${enquiry}" and We will respond to  you via your email ( ${email}).\n.`,
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