var express = require('express');
var router = express.Router();

var config = require('../config/index');

var indexController = require('../controllers/index.js');

// page
router.get('/', function (req, res, next) {
  return res.render('index', {
    'title': config.INDEX,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});

router.get('/internal_error', function (req, res, next) {
  res.render('internal_error', {
    'title': config.INTERNAL_ERROR,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  })
});

// user
router.get('/user/login', function (req, res, next) {
  return res.render('login', {
    'title': config.LOGIN,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/login', indexController.user.login);

router.get('/user/register', function(req, res, next) {
  return res.render('register', {
    'title': config.REGISTER,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/register', indexController.user.register);

router.get('/user/logout', function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

// 辅助函数
var checkLogin = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    var arr = req.url.split('/');
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('?')[0];
    }
    if (arr.length > 1 && arr[1] == '') {
      next();
    } else if (arr.length > 2 && arr[1] == 'user' && (arr[2] == 'register' || arr[2] == 'login')) {
      next();
    } else {
      req.flash('error', '请先登录');
      req.redirect('/user/login');
    }
  }
};

module.exports = router;