var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var validator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');
var multer = require('multer');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webuyandcook', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layouts', extname: '.hbs'}));
app.set('view engine', '.hbs');;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mySuperSecret',
  resave: false,
  saveUninitialized: false,
  store:MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/webuyandcook'
        }),
  cookie: {maxAge: 180*60*1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session
  next();
});

app.use('/user', userRouter);
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Page Not Found'});
});

module.exports = app;