var express = require('express');
var router = express.Router();

var config = require('../config/index');

var userController = require('../controllers/user.js');
var containerController = require('../controllers/container.js');

// page
router.get('/', function(req, res, next) {
  return res.render('index', {
    'title': config.INDEX,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});

router.get('/internal_error', function(req, res, next) {
  res.render('internal_error', {
    'title': config.INTERNAL_ERROR,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  })
});


// user
router.get('/user/register', function(req, res, next) {
  return res.render('user/register', {
    'title': config.REGISTER,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/register', userController.register);

router.get('/user/login', function(req, res, next) {
  return res.render('user/login', {
    'title': config.LOGIN,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/login', userController.login);

router.get('/user/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

router.get('/user/charge', function (req, res, next) {
  return res.render('user/charge', {
    'title': config.CHARGE,
    'user': req.session.user,
    'error': req.flash('error').toString(),
    'success': req.flash('success').toString()
  });
});
router.post('/user/charge', userController.charge);


// container
router.get('/container', containerController.getContainers);

router.get('/container/create', containerController.createContainer);
router.post('/container/create', containerController.createContainer);

module.exports = router;
