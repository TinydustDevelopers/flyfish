'use strict';

var crypto = require('crypto');
var pingpp = require('pingpp')('sk_test_nXXvTGzn5Ki1j9WbDCn9Oq98');

var config = require('../config/index.js');

var User = require('../models/user.js');

module.exports = {
  'register': function(req, res, next) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var passwordRepeat = req.body['password-repeat'];

    if (passwordRepeat != password) {
      req.flash('error', '两次输入的密码不一致!');
      return res.redirect('/user/register');
    }
    password = crypto.createHash('md5').update(password + config.SECRET).digest(
      'hex');

    var newUser = new User(email, username, password);
    User.get(email, function(error, user) {
      if (error) {
        return res.redirect('/internal_error');
      }
      if (user) {
        req.flash('error', '邮箱已被注册');
        return res.redirect('/user/register');
      }
      newUser.save(function(error, user) {
        if (error) {
          return res.redirect('/internal_error');
        }
        req.session.user = user;
        req.flash('success', '注册成功');
        res.redirect('/');
      })
    })
  }, // end register

  'login': function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    password = crypto.createHash('md5').update(password + config.SECRET).digest(
      'hex');

    User.get(email, function(error, user) {
      if (error) {
        return res.redirect('/internal_error');
      }
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/user/login');
      }
      if (user.password != password) {
        req.flash('error', '邮箱或密码错误');
        return res.redirect('/user/login')
      }
      req.session.user = user;
      if (req.session.originalUrl) {
        var redirectUrl = req.session.originalUrl;
        req.session.originalUrl = null;
      } else {
        var redirectUrl = '/';
      }
      res.redirect(redirectUrl);
    })
  }, // end login

  'charge': function (req, res, next) {
    pingpp.charges.create({
      subject: "V2EX",
      body: "V2EX React Native",
      amount: req.body.amount,
      order_no: "123456789",
      channel: "alipay",
      currency: "cny",
      client_ip: "127.0.0.1",
      app: {id: "app_1q18uDvHqHG4Lq1q"}
    }, function(error, charge) {
      if (error) {
        console.log(error);
        req.flash('error', '服务器内部错误');
        return res.status('500').json({
          'message': 'internal error'
        });
      }
      res.status(200).json(charge);
    });
  }, // end charge
};
