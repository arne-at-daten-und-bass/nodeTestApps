/**
 * Requirements
 * @type {object}
 * @type {function}
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Posts');
var showAll = require('./show-all');

/**
 * GET for listing all posts (see file './show-all.js')
 * @type {function}
 */
router.get('/', function(req, res, next) {
  showAll('index', Post, req, res, next);
});

module.exports = router;