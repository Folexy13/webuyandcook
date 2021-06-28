require('dotenv').config()
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2')

var csrfProtection = csrf();
router.use(csrfProtection);



router.get('/profile', isLoggedin, function (req, res, next) {
  User.find(function (err, image) {
    if (err) {
      throw err
    }
    var userImage =req.user.userImage;
    var firstName =req.user.fname;
    var lastName =req.user.lname;
    var password = req.user.password.slice(0, 14);
    var email = req.user.email
    res.render('user/profile', {title:'My Profile',userImage:userImage,email:email,firstName:firstName, lastName:lastName,password:password, layout:false});
  })
  
});
router.get('/profile/settings', isLoggedin, function (req, res, next) {
  User.find(function (err, image) {
      if (err) {
        throw err
      }
    var userImage = req.user.userImage;
    var firstName = req.user.fname;
    var lastName = req.user.lname;
      res.render('user/settings', {title:'My Account settings',userImage:userImage,firstName:firstName,lastName:lastName, layout:false});
    })
  
});
// router.post('/profile/settings/edit-profile', isLoggedin, function (req, res, next) {
//   User.find({ userImage: userImage }, function (err, image) {
//     if (err) throw err;
//     console.log(image)
//   });
// });


router.get('/logout', isLoggedin, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedin, function (req, res, next) {
  next()
});

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {title:'Register', csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if (url) {
    var url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(url);
  } else {
    return  res.redirect('/');
  }
});

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {title:'Register', csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function (req, res, next) {
  if (url) {
    var url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(url);
  } else {
    res.redirect('/')
  }
});


function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedin(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;