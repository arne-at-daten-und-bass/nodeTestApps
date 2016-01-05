/**
 * [express description]
 * @type {object}
 * @type {function}
 * @todo integrate isLoggedIn for user creating the post as central util
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Posts');
var showAll = require('./show-all');
var showOne = require('./show-one');
var showCreate = require('./show-create');
var createOne = require('./create-one');
var showEdit = require('./show-edit');
var commentOne = require('./comment-one');
var deleteOne = require('./delete-one');

router.get('/', function(req, res, next) {
  Post.find({}, {_id: 0, title: 1}, function(err, posts) {
    if(err) {
      return next(err);
    }
    res.json(posts);
  }); 
});

/**
 * GET for listing all posts (see file './show-all.js')
 * @type {function}
 */
router.get('/show-all', function(req, res, next) {
  showAll('posts/show-all', Post, req, res, next);
});

/**
 * GET for displaing existing post (see file './show-one.js')
 * @type {function}
 */
router.get('/id/:id', function(req, res) {
  showOne('posts/view', Post, req, res);
});

/**
 * GET for displaying create new post page (see file './show-create.js')
 * @type {function}
 */
router.get('/create', function(req, res) {
  showCreate('posts/create', req, res);
});

/**
 * POST for creating new post, only for logged in users (see file './create-one.js')
 * @type {function}
 */
router.post('/create', function(req, res, next) {
  var update = {
    title: req.param('title'),
    body: req.param('body'),
    author: req.session.user
  };

  createOne(update, Post, '/posts', req, res, next);
});

/**
 * GET for showing edit post page, only for logged in users (see file './show-edit.js')
 * @type {function}
 */
router.get('/edit/:id', function(req, res, next) {
  showEdit(Post, 'posts/create.jade', req, res, next);
});

/**
 * POST for editing posts
 * @type {function}
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {             if (req.session && req.session.user) {    Post.edit(req, function(err) {      if(err) {        return next(err);      }      res.redirect('/posts/id/' + req.param('id'));    });  }  else {    res.redirect('/users/login');  }} [description]
 * @return {[type]}       [description]
 */
router.post('/edit/:id', function(req, res, next) {
  if (req.session && req.session.user) {
    Post.edit(req, function(err) {
      if (err) {
        return next(err);
      }

      res.redirect('/posts/id/' + req.param('id'));
    });
  } else {
    res.redirect('/users/login');
  }
});

/**
 * POST for commenting on a post, only for users logged in (see file './comment-one.js')
 * @type {function}
 */
router.post('/comment/:id', function(req, res, next) {
  commentOne(Post, '/posts', req, res, next);
});

/**
 * GET for deleting one post entity, only for the logged in user who created the post (see file './delete-one.js')
 * @type {function}
 */
router.get('/remove/:id', function(req, res, next) {
  deleteOne(Post, '/posts', req, res, next);
});

/**
 * Exports
 * @type {function}
 */

module.exports = router;