'use strict';

var exec = require('child_process').exec;

var config = require('../config/index.js');

function Image() {}

Image.get = function(callback) {
  var result = exec('docker images', function(error, stdout, stderr) {
    if (error) {
      return callback(error);
    }

    if (stderr) {
      return callback(error);
    }

    var images = stdout.split('\n');
    images.pop();

    var attributes = images[0].split(/\s{2,}/);
    images.shift();

    for (var i = 0, iLength = images.length; i < iLength; i++) {
      var image = images[i].split(/\s{2,}/);
      var obj = {};
      for (var j = 0, aLength = attributes.length; j < aLength; j++) {
        obj[attributes[j]] = image[j];
      }
      images[i] = obj;
    }

    callback(null, images);
  });
}; // end getImage

module.exports = Image;
