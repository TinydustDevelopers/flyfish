'use strict';

var crypto = require('crypto');

var config = require('../config/index.js');

var User = require('../models/user.js');

module.exports = {
  'user': {
    'register': function (req, res, next) {
      var email = req.body.email;
      var username = req.body.username;
      var password = req.body.password;
      var passwordRepeat = req.body['password-repeat'];

      if (passwordRepeat != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/user/register');
      }
      password = crypto.createHash('md5').update(password + config.SECRET).digest('hex');

      var newUser = new User(email, username, password);
      User.get(email, function (error, user) {
        if (error) {
          return res.redirect('/internal_error');
        }
        if (user) {
          req.flash('error', '邮箱已被注册');
          return res.redirect('/user/register');
        }
        newUser.save(function (error, user) {
          if (error) {
            return res.redirect('/internal_error');
          }
          req.session.user = user;
          req.flash('success', '注册成功');
          res.redirect('/');
        })
      })
    },

    'login': function (req, res, next) {
      console.log(req.session.user);
      var email = req.body.email;
      var password = req.body.password;
      password = crypto.createHash('md5').update(password + config.SECRET).digest('hex');

      User.get(email, function (error, user) {
        if (error) {
          return res.redirect('/internal_error');
        }
        if (!user) {
          req.flash('error', '用户不存在');
          return res.redirect('/user/login');
        }
        if (user.password != password) {
          req.flash('error', '邮箱或密码错误');
          req.session.user = user;
          res.redirect('/')
        }
        req.session.user = user;
        res.redirect('/');
      })
    }
  }
};