var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var db = mongoose.connection;
var flash = require('connect-flash');


var index = require('./routes/index');
var users = require('./routes/users');
var retailer = require('./routes/retailer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'myappisasecret',
    saveUninitialized:true,
    resave:true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  customValidators:{
    Equals: function(val1, val2){
      console.log(val1);
      console.log(val2);

      if(val1 === val2){
        console.log(val1, val2, "returnning truwe");
        return true;
      }
      console.log("returning false");
      return false;
    }
  },
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use('/', index);
app.use('/users', users);
app.use('/retailer', retailer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
