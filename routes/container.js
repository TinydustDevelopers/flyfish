var express = require('express');
var router = express.Router();

var config = require('../config/index');

var containerController = require('../controllers/container.js');

// container
router.get('/', containerController.getContainers);

router.get('/create', containerController.createContainer);
router.post('/create', containerController.createContainer);

module.exports = router;
