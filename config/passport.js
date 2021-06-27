var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    });
});



passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    cpasswordField: 'cpassword',
    firstnameField: 'fname',
    lastnameField: 'lname',
    phoneField: 'phone',
    addressField: 'address',
    imageField: 'userImage',
    passReqToCallback: true
}, function (req, email,password,done) {
   req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Your Passwords must be more than 4 digits').notEmpty().isLength({ min: 4 });
    req.checkBody('cpassword', 'Your Passwords must be more than 4 digits').notEmpty().isLength({ min: 4 });
    req.checkBody('fname', 'First name cannot be empty').notEmpty();
    req.checkBody('lname', 'Last Name cannot be empty').notEmpty();
    req.checkBody('phone', 'Your Phone number is required').notEmpty();
    req.checkBody('address', 'Your address is required').notEmpty();

    
    var errors = req.validationErrors();

    if (errors) {
        var messages = []
        errors.forEach(function (error) {
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages))
    }
    
    

    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(user)
        }
        if (req.body.password !== req.body.cpassword) {
            return done(null, false, {message: 'Password does not match'})
        }
        if (user) {
            return done(null, false, {message: 'The email you entered is associated with another account'})
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.fname = req.body.fname;
        newUser.lname = req.body.lname;
        newUser.phone = req.body.phone;
        newUser.address = req.body.address;
        newUser.userImage = req.body.userImage;
        
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
}, function (req, email, password, done) {
    req.checkBody('email', 'This is not a valid Email').notEmpty().isEmail();
    req.checkBody('password', 'Incorrect Login Details').notEmpty().isLength({ min: 4 });
    
    var errors = req.validationErrors();

    if (errors) {
        var messages = []
        errors.forEach(function (error) {
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages))
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(user)
        }
        if (!user) {
            return done(null, false, { message: `${email} is not a registered account` })
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect login details' })
        }
        return done(null, user)
    });
    

}));