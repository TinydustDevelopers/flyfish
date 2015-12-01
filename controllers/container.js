'use strict';

var crypto = require('crypto');

var config = require('../config/index.js');

var Container = require('../models/container.js');
var containerApi = require('../apis/container.js');
var imageApi = require('../apis/image.js');

module.exports = {
  'getContainers': function(req, res, next) {
    containerApi.getContainers(function (error, containers) {
      if (error) {
        console.error(error);
        return res.redirect('/internal_error');
      }

      var upContainers = [];
      var exitContainers = [];
      for (var i = 0, cLength = containers.length; i < cLength; i++) {
        // timestamp to date
        var date = new Date(containers[i].Created * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        var created = year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;

        var c = {
          'name': containers[i].Names[0].slice(1),
          'image': containers[i].Image,
          'port': containers[i].Ports.length > 0 ? containers[i].Ports[0].PublicPort + ':' + containers[i].Ports[0].PrivatePort : '',
          'created': created
        };

        if (containers[i].Status.split(' ')[0] == 'Up') {
          upContainers.push(c);
        } else {
          exitContainers.push(c);
        }
      }

      res.render('container/show', {
        'title': config.language.CONTAINER,
        'user': req.session.user,
        'error': req.flash('error').toString(),
        'success': req.flash('success').toString(),

        'upContainers': upContainers,
        'exitContainers': exitContainers
      });
    });
  },  // end getContainer

  'createContainer': function(req, res, next) {
    if (req.method == 'GET') {
      imageApi.getImages(function (error, images) {
        if (error) {
          console.error(error);
          return res.render('/internal_error');
        }

        for (var i = 0, iLength = images.length; i < iLength; i++) {
          images[i] = images[i].RepoTags[0];
        }

        res.render('container/create', {
          'title': config.language.CREATE_CONTAINER,
          'user': req.session.user,
          'error': req.flash('error').toString(),
          'success': req.flash('success').toString(),

          'images': images
        })
      });
    } else if (req.method == 'POST') {
      var name = req.body['container-name'];
      var image = req.body['image-name'];
      var command = req.body['command'];
      var port = req.body['port'];

      if (!(name && command && port && image)) {
        req.flash('error', '容器信息不完整');
        return res.redirect('/container/create');
      }

      name = req.session.user.username + '-' + req.body['container-name'];
      var url = config.server.host + '/webhook/container/' + crypto.createHash('md5').update(name).digest('hex');

      var newContainer = {
        'name': name,
        'image': image,
        'command': command,
        'port': port,
        'Id': '',
        'dir': config.repo.location + '/' + name,
        'link': [],
        'url': url,
        'user_id': req.session.user._id,
        'start_at': new Date().getTime(),
        'restart_at': 0,
        'exit_at': 0,
        'restart_num': 0,
        'exit_num': 0,
        'error_exit_num': 0,
        'deleted': 0
      };

      Container.getByName(name, function (error, container) {
        if (error) {
          console.error(error);
          return res.render('/internal_error');
        }
        if (container) {
          req.flash('error', '容器名已被占');
          return res.redirect('/container/create');
        }
        Container.insert(newContainer, function (error, container) {
          if (error) {
            console.error(error);
            return res.render('/internal_error');
          }

          var successMessage = '容器创建成功, 请将: ' + container.url + ' 添加到 GitHub 项目的 WebHook 地址栏中。';
          req.flash('success', successMessage);
          res.redirect('/container');
        })
      });
    }
  },  // end createContainer
};
