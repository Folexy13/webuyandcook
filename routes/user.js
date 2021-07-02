// Importing modules
require('dotenv').config()
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');


// CSRF protection for our routing
var csrfProtection = csrf();
router.use(csrfProtection);

//Users Routing

router.get('/profile', isLoggedin, function (req, res, next) {
  User.find(function(err, image) {
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
      res.render('user/settings', {title:'My Account settings',csrfToken: req.csrfToken(),userImage:userImage,firstName:firstName,lastName:lastName, layout:false});
    })
  
});


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
    var email = req.body.email
    var firstname = req.body.fname;
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
    subject: 'WebuyNdCook Welcomes you',
    text : `Hello ${firstname}\n\nThank you for joining our team,Accept or hearty welcome.\n  Here, we are interested to give you the best meal offer at a very cheap price and if you stay long with us by patronising us often, you can stand the chance to eat free or even at discounted price. Slide in to our website @ www.webuyandcook.com to get even more\n\n Thanks\n WebuyNdCook Team`,
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
    return  res.redirect('/');
  }
});

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {title:'Login', csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true,
}), function (req, res, next) {
  if (url) {
    var url = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(url);
  } else {
    res.redirect('/')
  }
});

router.get('/forgot', function (req, res, next) {
  var errorMsg = req.flash('error');
  res.render('user/forgot-password', {title:'Forgot password',csrfToken: req.csrfToken(),errorMsg:errorMsg,hasErrors:errorMsg.length>0 });
});

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    }, function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
         return done (null,false,req.flash('error', 'This account does not exist in our database'));
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1hour

        user.save(function (err) {
          done(err, token, user);
        });
      })
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service:'GMAIL',
        port: 465,
        secure: true,
        auth: {
          user: 'folajimiopeyemisax13@gmail.com',
          pass: process.env.PASSWORD,
        } ,tls: {
        rejectUnauthorized: false
    }
      });
      let from = `Admin@Webuyandcook<folajimiopeyemisax13@gmail.com>`
      var mailOptions = {
        to: user.email,
        from: from,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          return res.redirect('/user/forgot')
        }
        console.log('mail sent');
        req.flash('success', "Reset password link sent to your email");
        done(err, 'done');
      })
    }
  ], function (err) {
    if (err) return next(err)
    res.redirect('/user/forgot')
  });
});

router.get('/reset/:token', function (req, res) {
  var errMsg = req.flash('error');
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset is invalid or token expired.');
      return res.redirect('/user/reset/:token')
    }
    res.render('user/reset-password', { title:'Reset Password', token:req.params.token,csrfToken: req.csrfToken(),errMsg:errMsg,hasErrors:errMsg.length>0 })
  });
});

router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset is invalid or token expired.');
          return res.redirect('back')
        }
        if (req.body.password === req.body.confirm) {
          var userId = user._id;
          var hashedPwd = user.encryptPassword(req.body.password)
          User.findByIdAndUpdate({ _id: userId }, { password: hashedPwd }, { new: true }, function (err, docs) {
            if (err) console.log(err)
             user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.hash = undefined;
            user.salt = undefined
            user.save(function (err) {
                req.login(user, function (err) {
                  done(err, user)
                });
              });
          });
          } else {
            req.flash("error", "Password do not match")
            return res.redirect("back")
          }
      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'folajimiopeyemisax13@gmail.com',
          pass: process.env.PASSWORD
        } ,tls: {
        rejectUnauthorized: false
    }
      });
      let from = `Admin@Webuyandcook<folajimiopeyemisax13@gmail.com>`
      var mailOptions = {
        to: user.email,
        from: from,
        subject: 'Password Changed',
        text: ' Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log('mail sent');
        req.flash('success', "Password successfully changed");
        done(err, 'done');
      });
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      throw err
    }
    res.redirect('/')
  }
  );
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