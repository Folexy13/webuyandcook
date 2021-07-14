// Defining modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Handlebars = require('handlebars')
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var Cors = require('cors');
var session = require('express-session');
var validator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');

// configuring routes
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

// configuring the app
var app = express();
var port = process.env.PORT|| 3000
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
require('./config/passport');

//configuring  view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layouts', extname: '.hbs',handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');;


// configuring app middlwares
app.use(logger('dev'));
app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mySuperSecret',
  resave: false,
  saveUninitialized: false,
  store:MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
  cookie: {
    maxAge: 6* 60 * 60 * 1000 // cookies expires after 6hours
  }
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

// Defining the listening port
app.listen(port,()=>console.log(`Now listening on localhost: ${port}`))
module.exports = app;
