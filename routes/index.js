var express = require('express');
var router = express.Router();

var config = require('../config/index');

var userController = require('../controllers/user.js');

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
router.get('/user/register', function(req, res, next) {
  return res.render('register', {
    'title': config.REGISTER,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/register', userController.register);

router.get('/user/login', function (req, res, next) {
  return res.render('login', {
    'title': config.LOGIN,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/login', userController.login);

router.get('/user/logout', function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

router.get('/user/:userId/container', userController.getContainer);

router.get('/user/:userId/container/create', function (req, res, next) {
  //res.render('create_container');
});

module.exports = router;