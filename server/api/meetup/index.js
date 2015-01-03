'use strict';

var express = require('express');
var controller = require('./meetup.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/create', auth.isAuthenticated());
router.post('/create', auth.isAuthenticated(), controller.create);
router.get('/:id', controller.show);
//router.put('/:id', auth.isAuthenticated(), controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
