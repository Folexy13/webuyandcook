require('dotenv').config();
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var Cart = require('../models/cart');
var async = require('async');
var User = require('../models/user');
var Order = require('../models/order')
var Qmenu = require('../models/qMenu'); 
var Smenu = require('../models/sMenu');
var Fmenu = require('../models/fMenu');
var FRmenu = require('../models/frMenu');






router.get('/', function (req, res, next) {
    var successMsg = req.flash('success');
    var sMenuChunks = [];
    var qMenuChunks = [];
    var fMenuChunks = [];
    var frMenuChunks = [];
  
    async.waterfall([
      function (done) {

        Qmenu.find(function (err, docs) {
        if (err) {
        return done(null, err, false);
        }
        var chunkSize = 2
      for (var i = 0; i < docs.length; i += chunkSize) {
        qMenuChunks.push(docs.slice(i, i + chunkSize))
      }
        done()
        });
        
    },
      function (done) {
      Smenu.find(function (err, docs) {
        if (err) {
        return done(null, err, false)
      }
      var chunkSize = 3
      for (var i = 0; i < docs.length; i += chunkSize) {
        sMenuChunks.push(docs.slice(i, i + chunkSize))
        }
        done()
      });
      },
      function (done) {

        Fmenu.find(function (err, docs) {
        if (err) {
        return done(null, err, false)
        }
          
          var chunkSize = 2
      for (var i = 0; i < docs.length; i += chunkSize) {
        fMenuChunks.push(docs.slice(i, i + chunkSize))
      }
        done()
        });
        
      },
      function (done) {

        FRmenu.find(function (err, docs) {
        if (err) {
        return done (null,err,false);
        }
          
          var chunkSize = 2
      for (var i = 0; i < docs.length; i += chunkSize) {
        frMenuChunks.push(docs.slice(i, i + chunkSize))
      }
        done()
        });
        
    },
    ], function (err) {
      if (err) return next(err)
      if (req.isAuthenticated()) {
      var firstName = req.user.fname;
      var lastName = req.user.lname;
      var cart = req.session.cart;
      var userImage = req.user.userImage
      return res.render('index', {
      title: 'WEBUYNDCOOK',
      firstName: firstName,
      lastName: lastName,
      userImage: userImage,
      smenus: sMenuChunks,
      qmenus: qMenuChunks,
      fmenus: fMenuChunks,
      cart:cart ? cart.totalQty : 0,
      frmenus: frMenuChunks,
      successMsg: successMsg,
      success: successMsg.length > 0
    })
      }
    return res.render('index', {title: 'WEBUYNDCOOK',smenus: sMenuChunks,cart:cart ? cart.totalQty : 0,qmenus: qMenuChunks,fmenus: fMenuChunks,frmenus: frMenuChunks});
    });
});

router.get('/addqmenu-to-cart/:id', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
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

router.get('/addfrmenu-to-cart/:id', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var MenuId = req.params.id;
    FRmenu.findById(MenuId, function (err, Menu) {
    if (err) {
      return res.redirect('/')
    };
    cart.add(Menu, Menu.id);
         req.session.cart = cart;
         return res.redirect('/#menu');
    });

  
});

router.get('/increase/:id', function (req, res, next) {
  var MenuId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(MenuId);
  req.session.cart = cart;
  res.redirect('back')
});

router.get('/reduce/:id', function (req, res, next) {
  var MenuId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(MenuId);
  req.session.cart = cart;
  res.redirect('back')
});

router.get('/remove/:id', function (req, res, next) {
  var MenuId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(MenuId);
  req.session.cart = cart;
  res.redirect('back')
});

router.get('/shop/checkout',isLoggedin, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/profile/cart')
  };
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {title:'Proceed to payment',total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg,menu:cart.generateArray(),totalPrice:cart.totalPrice})
});

router.post('/checkout', isLoggedin, function (req, res, next) {
  res.redirect('/shop/checkout')
});

router.post('/order-checkout',isLoggedin, function (req, res, next) {
  var order = new Order({
    user: req.user,
    paymentStatus: "Bank Transfer",
    status: "pending",
    day: convertedDate,
    name: req.body.title,
    price: req.body.price,
    totalPrice: req.body.totalPrice,
    quantity: req.body.qty
  })
  order.save(function (err, result) {
    if (err) console.log(err)
  })
  req.session.cart = null;
  res.redirect('/user/profile');
});

router.post('/order', function (req, res, next) {
  var name = req.body.fName,
    phone = req.body.phone,
    address = req.body.address,
    event = req.body.event,
    date = req.body.date,
    time = req.body.time,
    menu = req.body.menu,
    email = req.body.email
  
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
  transporter.use('compile', htmlToText());
  var emailOptions = {
    from: from,
    to: email,
    cc: 'chrisentechnology@yahoo.com',
    subject: 'Order Recieved',
    html: `<h1 style="font-size:1em">Good-day ${name}</h1>
    Your Order has been recieved.Below is your Order Details<br>
    Menu: The Menu you required is ${menu}<br><br>
    Address:Your delivery address is ${address}<br><br>
    Phone: Your contact line is ${phone}<br><br>
    Name: Your name is Mr/Mrs ${name}<br><br>
    Date:The day you need your order is on ${date}<br><br>
    Time:And the time for your request is ${time}<br><br>
    Event:You chose ${event} for the event surrounding your order<br><br>
    <br><br>
  
    <h3>One of our Agent will get back to you. But if you got no response in the next 20 minutes it could have been network. Just call this number (08113892144) or send a whatsapp message to the num</strong></h3>`,
     
  };
  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('back')
    }
  });
})

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

router.post('/change-picture', isLoggedin, function (req, res, next) {
  var userImg = req.body.userImage
  if (userImg === 'null') {
    req.flash('error', 'You did not upload any file')
  }
  User.findOne({_id:req.user._id}, function (err, user) {
    User.findByIdAndUpdate({ _id: user._id }, { userImage: userImg}, { new: true }, function (err, user) {
      if (err) console.log('failed')
      user.save(function (err) {
        if (err) console.log(err)
        res.redirect('/user/profile/settings')
      })
    })
  })
});

router.post('/update-user', isLoggedin, function (req, res, next) {
  var user = req.user, mname = req.body.mname, fname = req.body.fname, lname = req.body.lname, phone = req.body.phone, address = req.body.address, password = req.body.password
  var checkMname = mname === '', checkFname = fname === '', checkLname = lname === '', checkPhone = phone === '', checkAddress = address === '', checkPassword = password === ''
  User.findByIdAndUpdate({ _id: user._id },
    {
    mname: checkMname ? user.mname : mname,
    fname: checkFname ? user.fname : fname,
    lname: checkLname ? user.lname : lname,
    phone: checkPhone ? user.phone : phone,
    address: checkAddress ? user.address : address,
    password: checkPassword ? user.password : user.encryptPassword(password)},
    { upsert: true }, function (err, user) {
      user.save(function (err) {
      if(err) console.log(err)
    })
    
 })
  res.redirect('/user/profile/settings')
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


router.get('/profile/cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/cart',{title:'My Cart', qmenus: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cart', {title:'My Cart',qmenus:cart.generateArray(),smenus:cart.generateArray(), totalPrice: cart.totalPrice})
})
module.exports = router;
// Getting today date and time
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();


var day = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
var convertedDate = convertTZ(day, "Africa/Lagos")

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
  req.session.oldUrl = req.url
  res.redirect('/user/signin');
  
}
