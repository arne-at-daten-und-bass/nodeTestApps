'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Posts = require('../repositories/posts');
var Post = require('../models/post');
var controller = new Foxx.Controller(applicationContext);

var postIdSchema = joi.string().required()
.description('The id of the post')
.meta({allowMultiple: false});

var posts = new Posts(
  applicationContext.collection('posts'),
  {model: Post}
);

/** Lists of all posts.
 *
 * This function simply returns the list of all Post.
 */
controller.get('/', function (req, res) {
  res.json(_.map(posts.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new post.
 *
 * Creates a new post. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var post = req.parameters.post;
  res.json(posts.save(post).forClient());
})
.bodyParam('post', {
  description: 'The post you want to create',
  type: Post
});

/** Reads a post.
 *
 * Reads a post.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(posts.byId(id).forClient());
})
.pathParam('id', postIdSchema)
.errorResponse(ArangoError, 404, 'The post could not be found');

/** Replaces a post.
 *
 * Changes a post. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var post = req.parameters.post;
  res.json(posts.replaceById(id, post));
})
.pathParam('id', postIdSchema)
.bodyParam('post', {
  description: 'The post you want your old one to be replaced with',
  type: Post
})
.errorResponse(ArangoError, 404, 'The post could not be found');

/** Updates a post.
 *
 * Changes a post. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(posts.updateById(id, patchData));
})
.pathParam('id', postIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your post to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The post could not be found');

/** Removes a post.
 *
 * Removes a post.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  posts.removeById(id);
  res.json({success: true});
})
.pathParam('id', postIdSchema)
.errorResponse(ArangoError, 404, 'The post could not be found');
