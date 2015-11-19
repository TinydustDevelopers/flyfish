'use strict';

var config = require('../config/index.js');

var Image = require('../models/image.js');

module.exports = {
  'getImages': function(req, res, next) {
    Image.get(function (error, images) {
      if (error) {
        console.log(error);
        return res.redirect('/internal_error');
      }
      res.render('Image/show', {
        'title': config.IMAGE,
        'user': req.session.user,
        'error': req.flash('error').toString(),
        'success': req.flash('success').toString(),

        'images': images
      });
    });
  },  // end getImage
};
