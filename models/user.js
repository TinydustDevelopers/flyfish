'use strict';

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var config = require('../config/index.js');

function User(email, username, password) {
  this.email = email;
  this.username = username;
  this.password = password;
}

MongoClient.connect(config.mongodb.url, function (error, db) {
  if (error) {
    console.log('connect to mongodb error');
    process.exit(1);
  }

  var collection = db.collection('users');

  User.prototype.save = function (callback) {
    var user = {
      'username': this.username,
      'password': this.password,
      'email': this.email
    };

    collection.insertOne(user, function (error, user) {
      if (error) {
        return callback(error);
      }
      callback(null, user.ops[0]);
    })
  };

  User.get = function (email, callback) {
    collection.findOne({
      'email': email
    }, function (error, user) {
      if (error) {
        return callback(error);
      }
      callback(null, user)
    });
  };
});

module.exports = User;