// Importing modules
require('dotenv').config()
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');
var async = require('async');
var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var crypto = require('crypto');
var Order = require('../models/order');

// CSRF protection for our routing
var csrfProtection = csrf();
router.use(csrfProtection);

//Users Routing

router.get('/profile', isLoggedin, async function (req, res, next) {
await Order.find({ user: req.user }, function (err, result) {
    if (err) console.log('Error in Order')
    var userImage = req.user.userImage;
    if (err) return next(err)
    var menu = result
    var firstName =req.user.fname;
    var cart = req.session.cart;
    var lastName =req.user.lname;
    var password = req.user.password.slice(0, 14);
  var email = req.user.email
  res.render('user/profile', {
    displayOrder: "View All",
    title: 'My Profile',
    Link: '/user/profile/view-all',
    userImage: userImage,
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    cart:cart ? cart.totalQty : 0,
    layout: false,
    menu: menu,
    });
  
}).sort({_id:-1}).limit(3)
});

router.get('/profile/view-all', isLoggedin, async function (req, res, next) {
  req.session.oldUrl = ('/user/profile/')
  await Order.find({ user: req.user }, function (err, result) {
    if (err) console.log('Error in Order')
    var userImage = req.user.userImage;
    if (err) return next(err)
    var menu = result
    var firstName =req.user.fname;
    var cart = req.session.cart;
    var lastName =req.user.lname;
    var password = req.user.password.slice(0, 14);
    var email = req.user.email
    res.render('user/profile', {
    displayOrder: "Show Less",
    Link: '/user/profile',
    title: 'My Profile',
    userImage: userImage,
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    cart:cart ? cart.totalQty : 0,
    layout: false,
    menu: menu,
    });
    
  
    
}).sort({_id:-1})
})

router.get('/profile/settings', isLoggedin, async function (req, res, next) {
await User.find(function (err, image) {
      if (err) {
        throw err
  }
  var errMsg = req.flash('error')
    var school =req.user.school;
    var department =req.user.department;
    var level =req.user.level;
  var userImage = req.user.userImage,
    firstName = req.user.fname,
    lastName = req.user.lname,
    middleName = req.user.mname,
    email = req.user.email,
    phone = req.user.phone,
    cart = req.session.cart,
    address = req.user.address;
  res.render('user/settings', {
    title: 'My Account settings',
    csrfToken: req.csrfToken(),
    userImage: userImage,
    firstName: firstName,
    lastName: lastName,
    school: school,
    department: department,
    level: level,
    cart:cart ? cart.totalQty : 0,
    email: email,
    middleName:middleName,
    phone: phone,
    address: address,
    errMsg: errMsg,
    hasErrors: errMsg.length > 0,
    layout: false
  });
    })
  
});

router.get('/notifications', isLoggedin, (req, res, next) => {
  Order.find({user:req.user },(err, result) => {
    if (err) console.log(err)
    var notifications = result
    var count = notifications.count;
    
    for (var i = 0; i < result.length; i++){
      var change = result[i].change;
    }
    if (change == 'inprogress') {
      var orderApproved = change
    } else if (change == 'cancelled') {
      var orderCancelled = change 
    } else {
      var orderDelivered = change
    }
    var cart = req.session.cart
    res.render("user/notification",
      {
        title: "Notifications",
        userImage: req.user.userImage,
        cart: cart ? cart.totalQty : 0,
        orderApproved: orderApproved,
        orderCancelled: orderCancelled,
        orderDelivered: orderDelivered,
        count: count? count: 0,
        notifications: notifications,
        layout: false
      })
    
  }).sort({_id:-1})
  
})

router.get('/logout', isLoggedin, function (req, res, next) {
    req.logout();
    req.session.oldUrl = null
    res.redirect('/');
});


// ADMIN SECTION
router.get('/adminow', function (req, res) {
    console.log(result)
    if (err)console.log(err)
    var messages = req.flash('error')
  res.render('Admin/signup',
    {
      title: "Admin|Signin",
      csrfToken: req.csrfToken(),
      messages: messages,
      hasErrors: messages.length > 0
    })
 
  
});

router.post('/admin/signup', passport.authenticate('local.adminSignup', {
  successRedirect: '/user/admin/signin',
  failureRedirect: '/user/adminow',
  failureFlash: true,
}))

router.get('/admin/signin', function (req, res) {
  var messages = req.flash('error');
  res.render('Admin/signin', { title: 'Admin|Log-in', csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0})
});

router.post('/admin/signin', passport.authenticate('local.adminSignin', {
  successRedirect: '/user/admin',
  failureRedirect: '/user/admin/signin',
  failureFlash: true

}))

router.get('/admin', function (req, res) {
  User.find({}, function (err, customer) {
    if(err)console.error(err)
  Order.find({}).sort({_id:-1}).limit(3).populate('user').exec(function (err, result) {
    if (err) console.log(err)
    for (var i = 0; i < result.length; i++){
      var user = result[i].user
      var fname = user.fname
      var lname= user.lname
      var phone = user.phone
    }
  res.render('Admin/index',
      {
        title: 'Admin | webuyandcook',
        fname: fname ? user.fname : null,
        lname: lname? user.lname:null,
        order: result,
        displayOrder: "View all",
        displayCustomer: "View all",
        linkOrder: '/user/view-all-order',
        linkCustomer: '/user/view-all-customer',
        user: user,
        customer:customer,
        csrfToken:req.csrfToken(),
        status: result.status,
        phone: phone? user.phone:null,
        layout: false
      })
  })
  }).sort({_id:-1}).limit(3)
  
})

router.get('/view-all-order', function (req, res) {
   User.find({}, function (err, customer) {
    if(err)console.error(err)
  Order.find({}).sort({_id:-1}).populate('user').exec(function (err, result) {
    if (err) console.log(err)
    for (var i = 0; i < result.length; i++){
      var user = result[i].user
      var fname = user.fname
      var lname= user.lname
      var phone = user.phone
    }
  res.render('Admin/index',
    {
        displayOrder: "Show Less",
        linkOrder: '/user/admin',
        displayCustomer: "View all",
        linkCustomer: 'user/view-all-customer',
        title: 'Admin | webuyandcook',
        fname: fname ? user.fname : null,
        lname: lname? user.lname:null,
        order: result,
        user: user,
        customer:customer,
        csrfToken:req.csrfToken(),
        status: result.status,
        phone: phone? user.phone:null,
        layout: false
      })
  })
  }).sort({_id:-1}).limit(3)
  
});

router.get('/view-all-customer', function (req, res) {
   User.find({}, function (err, customer) {
    if(err)console.error(err)
  Order.find({}).sort({_id:-1}).limit(3).populate('user').exec(function (err, result) {
    if (err) console.log(err)
    for (var i = 0; i < result.length; i++){
      var user = result[i].user
      var fname = user.fname
      var lname= user.lname
      var phone = user.phone
    }
  res.render('Admin/index',
    {
        displayCustomer: "Show Less",
        linkCustomer: '/user/admin',
        displayOrder: "View all",
        linkOrder: 'user/view-all-order',
        title: 'Admin | webuyandcook',
        fname: fname ? user.fname : null,
        lname: lname? user.lname:null,
        order: result,
        user: user,
        customer:customer,
        csrfToken:req.csrfToken(),
        status: result.status,
        phone: phone? user.phone:null,
        layout: false
      })
  })
  }).sort({_id:-1})
  
});
    
router.get('/accept/:id', function (req, res,next) {
  orderId = req.params.id;
  Order.findByIdAndUpdate({ _id: orderId }, { status: 'Ongoing',change:"inprogress" }, {upsert:true},function (err, updatedOrder) {
    updatedOrder.save(function (err) {
      if (err) console.error(err)
    })
    res.redirect('/user/admin')
  })
});

router.get('/confirm/:id', function (req, res) {
  orderId = req.params.id;
  Order.findByIdAndUpdate({ _id: orderId }, { status: 'Delivered' ,change:"delivered" }, { upsert: true }, function (err, updatedOrder) {
    updatedOrder.save(function (err) {
      if(err)console.error(err)
    
  User.findById({_id:updatedOrder.user}, function (err, customer) {
    if (err) console.log(err)
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
    to: customer.email,
    cc: 'chrisentechnology@yahoo.com',
    subject: 'Order Delivered',
    html: `Thanks ${customer.fname} ${customer.lname} for your patronage<br>
    <br>Here are your Order details:<br>
    Order:${updatedOrder.name}<br>
    Total Price:${updatedOrder.totalPrice}<br>
    OrderId: ${updatedOrder._id}<br>
    Status: Delivered
    <br><br> We appreciate and celebrate you. Please do come back again and also don.t forget to recommend us`,
     
  };
  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } 
  });
  })
  })
    res.redirect('/user/admin')
 })
})

router.get('/reject/:id', function (req, res) {
  orderId = req.params.id;
  Order.findByIdAndUpdate({ _id: orderId }, { status: 'Cancelled' ,change:"cancelled" }, { upsert: true }, function (err, updatedOrder) {
    
    updatedOrder.save(function (err) {
      if(err)console.error(err)
    })
    res.redirect('/user/admin')
  })
})

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
  if (req.session.oldUrl) {
    res.redirect(req.session.oldUrl);
    req.session.oldUrl = null;
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
  if (req.session.oldUrl) {
    res.redirect('/user/profile');
  } else {
    res.redirect('/user/profile')
  }
});

router.get('/forgot', function (req, res, next) {
  var errorMsg = req.flash('error');
  var sucessMsg = req.flash('success');
  res.render('user/forgot-password', {title:'Forgot password',csrfToken: req.csrfToken(),errorMsg:errorMsg,hasErrors:errorMsg.length>0, sucessMsg:sucessMsg,message:sucessMsg.length>0 });
});

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(30, function (err, buf) {
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
          req.flash('success')
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
    req.session.oldUrl = req.url
    res.redirect('/user/signin');
}

function isAdminLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/admin/signin');
}

function notLoggedin(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;