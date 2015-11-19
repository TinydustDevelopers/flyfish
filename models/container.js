'use strict';

var exec = require('child_process').exec;
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var config = require('../config/index.js');

function Container(containerName, command, imageName, containerUrl, userId) {
  this.containerName = containerName;
  this.command = command;
  this.imageName = imageName;
  this.containerUrl = containerUrl
  this.userId = userId;
}

Container.getFromSystem = function(callback) {
  var result = exec('docker ps -a', function(error, stdout, stderr) {
    if (error) {
      return callback(error);
    }

    if (stderr) {
      return callback(error);
    }

    var containers = stdout.split('\n');
    containers.pop();

    var attributes = containers[0].split(/\s{2,}/);
    containers.shift();

    for (var i = 0, cLength = containers.length; i < cLength; i++) {
      var container = containers[i].split(/\s{2,}/);
      // 处理 container 没有 PORT 字段
      if (container.length == 6) {
        container[6] = container[5];
        container[5] = '';
      }
      var obj = {};
      for (var j = 0, aLength = attributes.length; j < aLength; j++) {
        obj[attributes[j]] = container[j];
      }
      containers[i] = obj;
    }

    callback(null, containers);
  });
}; // end getImage

MongoClient.connect(config.mongodb.url, function(error, db) {
  var collection = db.collection('containers');

  Container.getFromMongodb = function(containerName, callback) {
    collection.findOne({
      'container_name': containerName
    }, function(error, container) {
      if (error) {
        return callback(error);
      }
      callback(null, container);
    });
  };

  Container.prototype.save = function(callback) {
    var container = {
      'container_name': this.containerName,
      'command': this.command,
      'image_name': this.imageName,
      'container_url': this.containerUrl,
      'user_id': this.userId
    };
    console.log(container);

    collection.insertOne(container, function(error, container) {
      if (error) {
        return callback(error);
      }
      callback(null, container.ops[0]);
    });
  };
});

module.exports = Container
