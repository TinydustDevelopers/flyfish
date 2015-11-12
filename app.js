var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStroe = require('connect-mongo')(session);
var flash = require('connect-flash');

var config = require('./config/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// session
app.use(session({
  'secret': config.SECRET,
  'key': 'dockerci',
  'cookie': {
    'maxAge': 1000 * 60 * 60 * 24 * 30
  },
  'store': new MongoStroe({
    'db': 'dockerci',
    'host': 'localhost',
    'port': 27017
  })
}));

// 登录拦截
app.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    var arr = req.url.split('/');
    for (var i = 0, length = arr.length; i < length; i++) {
      arr[i] = arr[i].split('?')[0];
    }
    if (arr.length > 1 && arr[1] == '') {
      next();
    } else if (arr.length > 2 && arr[1] == 'user' && (arr[2] == 'register' || arr[2] == 'login' || arr[2] == 'logout')) {
      next();
    } else {
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
      console.log('req.session.originalUrl: ' + req.session.originalUrl);
      req.flash('error', '请先登录');
      res.redirect('/user/login');
    }
  }
});

// routes
var indexRoute = require('./routes/index');
app.use('/', indexRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;