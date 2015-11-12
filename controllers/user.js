'use strict';

var crypto = require('crypto');
var exec = require('child_process').exec;
var fs = require('fs');

var config = require('../config/index.js');

var User = require('../models/user.js');

module.exports = {
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
  },  // end register

  'login': function (req, res, next) {
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
      if (req.session.originalUrl) {
        var redirectUrl = req.session.originalUrl;
        req.session.originalUrl = null;
      } else {
        var redirectUrl = '/';
      }
      console.log(redirectUrl);
      res.redirect(redirectUrl);
    })
  },  // end login

  'getContainer': function (req, res, next) {
    var result = exec('docker images', function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
        return res.redirect('/internal_error');
      }

      if (stderr) {
        console.log(('stderr: ' + stderr));
        return res.redirect('/internal_error');
      }

      var containers = stdout.split('\n');
      containers.pop();

      console.log(containers);

      var attributes = containers[0].split(/\s{2,}/);
      containers.shift();
      console.log(containers);

      for (var i = 0, cLength = containers.length; i < cLength; i++) {
        var container = containers[i].split(/\s{2,}/);
        var obj = {};
        for (var j = 0, aLength = attributes.length; j < aLength; j++) {
          obj[attributes[j]] = container[j];
        }
        containers[i] = obj;
      }
      console.log(containers);

      res.render('container/show', {
        'title': req.session.user.username,
        'user': req.session.user,
        'error': req.flash('error').toString(),
        'success': req.flash('success').toString(),

        'containers': containers
      });
    });
  },  // end getContainer

  'createContainer': function () {

  }  // end createContainer
};