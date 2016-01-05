/**
 * Requirements
 * @type {object}
 * @type {function}
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Database = mongoose.model('Databases');
var showAll = require('./show-all');
var showOne = require('./show-one');
var showCreate = require('./show-create');
var createOne = require('./create-one');
var showEdit = require('./show-edit');
var commentOne = require('./comment-one');
var deleteOne = require('./delete-one');

/**
 * GET for listing all databases (see file './show-all.js')
 * @type {function}
 */
router.get('/show-all', function(req, res, next) {
  showAll('databases/show-all', Database, req, res, next);
});

/**
 * GET for displaing one existing databse (see file './show-one.js')
 * @type {function}
 */
router.get('/id/:id', function(req, res) {
  showOne('databases/view', Database, req, res);
});

/**
 * GET for displaying create new database page, only for logged in users (see file './show-create.js')
 * @type {function}
 */
router.get('/create', function(req, res) {
  showCreate('databases/create', req, res);
});

/**
 * POST for actually creating a new database (entity), only for logged in users (see file './create-one.js')
 * @type {function}
 */
router.post('/create', function(req, res, next) {
  var update = {
    name: req.param('name'),
    type: req.param('type'),
    description: req.param('description'),
    author: req.session.user
  };

  createOne(update, Database, '/databases', req, res, next);
});

/**
 * GET for showing edit database page, only for logged in users (see file './show-edit.js')
 * @type {function}
 */
router.get('/edit/:id', function(req, res, next) {
  showEdit(Database, 'databases/create.jade', req, res, next);
});

/**
 * POST for actually editing databases, only for logged in users (see file './edit-one.js')
 * @type {function}
 */
router.post('/edit/:id', function(req, res, next) {
  var update = {
    $set: {
      name: req.param('name'),
      type: req.param('type'),
      description: req.param('description')
    }
  };
  
  editOne(update, Database, '/databases', req, res, next);
});

/**
 * POST for commenting on a database, only for users logged in (see file './comment-one.js')
 * @type {function}
 */
router.post('/comment/:id', function(req, res, next) {
  commentOne(Database, '/databases', req, res, next);
});

/**
 * GET for deleting one database entity, only for the logged in user who created the database (see file './delete-one.js')
 * @type {function}
 */
router.get('/remove/:id', function(req, res, next) {
  deleteOne(Database, '/databases', req, res, next);
});

/**
 * Exports
 * @type {function}
 */
module.exports = router;