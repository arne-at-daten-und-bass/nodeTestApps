/**
 * [express description]
 * @type {[type]}
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Person = mongoose.model('Persons');
var showAll = require('./show-all');
var showOne = require('./show-one');
var showCreate = require('./show-create');
var createOne = require('./create-one');
var showEdit = require('./show-edit');
var editOne = require('./edit-one');
var commentOne = require('./comment-one');
var deleteOne = require('./delete-one');

/**
 * GET for listing all persons (see file './show-all.js')
 * @type {function}
 */
router.get('/show-all', function(req, res, next) {
  showAll('persons/show-all', Person, req, res, next);
});

/**
 * GET for displaing one existing person (see file './show-one.js')
 * @type {function}
 */
router.get('/id/:id', function(req, res) {
  showOne('persons/view', Person, req, res);
});

/**
 * GET for displaying create new person page (see file './show-create.js')
 * @type {function}
 */
router.get('/create', function(req, res) {
  showCreate('persons/create', req, res);
});

/**
 * POST for actually creating a new person, only for logged in users (see file './create-one.js')
 * @type {function}
 */
router.post('/create', function(req, res, next) {
  var update = {
    name: {
      first: req.param('firstName'),
      last: req.param('lastName')
    },
    profession: req.param('profession'),
    description: req.param('description'),
    email: req.param('email'),
    twitter: req.param('twitter'),
    author: req.session.user
  };

  createOne(update, Person, '/persons', req, res, next);
});

/**
 * GET for showing edit person page, only for logged in users (see file './show-edit.js')
 * @type {function}
 */
router.get('/edit/:id', function(req, res, next) {
  showEdit(Person, 'persons/create.jade', req, res, next)
});

/**
 * POST for editing person, only for logged in users (see file './edit-one.js')
 * @type {function}
 */
router.post('/edit/:id', function(req, res, next) {
  var update = {
    $set: {
      name: {
        first: req.param('firstName'),
        last: req.param('lastName')
      },
      profession: req.param('profession'),
      description: req.param('description'),
      email: req.param('email'),
      twitter: req.param('twitter'),
    }
  };

  editOne(update, Person, '/persons', req, res, next)
});

/**
 * POST for commenting on a person, only for users logged in (see file './comment-one.js')
 * @type {function}
 */
router.post('/comment/:id', function(req, res, next) {
  commentOne(Person, '/persons', req, res, next);
});

/**
 * GET for deleting one person entity, only for the logged in user who created the person (see file './delete-one.js')
 * @type {function}
 */
router.get('/remove/:id', function(req, res, next) {
  deleteOne(Person, '/persons', req, res, next);
});

/**
 * Exports
 * @type {function}
 */
module.exports = router;