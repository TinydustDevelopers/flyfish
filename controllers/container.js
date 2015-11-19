'use strict';

var crypto = require('crypto');

var config = require('../config/index.js');

var Container = require('../models/container.js');
var Image = require('../models/image.js');

module.exports = {
  'getContainers': function(req, res, next) {
    Container.getFromSystem(function (error, containers) {
      if (error) {
        console.log(error);
        return res.redirect('/internal_error');
      }
      res.render('container/show', {
        'title': config.CONTAINER,
        'user': req.session.user,
        'error': req.flash('error').toString(),
        'success': req.flash('success').toString(),

        'containers': containers
      });
    });
  },  // end getContainer

  'createContainer': function(req, res, next) {
    if (req.method == 'GET') {
      Image.get(function (error, images) {
        if (error) {
          console.log(error);
          return res.render('/internal_error');
        }
        for (var i = 0, iLength = images.length; i < iLength; i++) {
          images[i] = images[i].REPOSITORY + ':' + images[i].TAG;
        }
        res.render('container/create', {
          'title': config.CREATE_CONTAINER,
          'user': req.session.user,
          'error': req.flash('error').toString(),
          'success': req.flash('success').toString(),

          'images': images
        })
      });
    } else if (req.method == 'POST') {
      var containerName = req.session.user.username + '-' + req.body['container-name'];
      var command = req.body['command'];
      var imageName = req.body['image-name'];
      var userId = req.session.user._id;
      var containerUrl = config.server.host + '/webhook/container/' + crypto.createHash('md5').update(containerName).digest('hex');
      console.log(containerUrl);
      var newContainer = new Container(containerName, command, imageName, containerUrl, userId);

      console.log(newContainer);
      Container.getFromMongodbByName(containerName, function (error, container) {
        if (error) {
          console.log(error);
          return res.render('/internal_error');
        }
        if (container) {
          req.flash('error', '容器名已被占');
          return res.redirect('/container/create');
        }
        newContainer.save(function (error, container) {
          if (error) {
            console.log(error);
            return res.render('/internal_error');
          }

          var successMessage = '容器创建成功, 请将: ' + container.url + ' 添加到 GitHub 项目的 WebHook 地址栏中。';
          req.flash('success', successMessage);
          res.redirect('/container');
        });
      });
    }
  },  // end createContainer
};
