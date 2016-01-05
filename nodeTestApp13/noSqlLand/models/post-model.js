/**
 * Requirements
 * @type {object}
 * @todo  Integrate module 'lifecycle' for twitter notification
 */
var mongoose = require('mongoose');

/**
 * Mongoose schema definition for blog posts
 * @type {object}
 */
var schema = mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  body: String,
  author: {
    type: String,
    ref: 'Users'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Model-based function for looking up related comments
 * @type {function}
 * @param  {[type]}   id       Id of the post
 * @param  {function} callback Callback
 * @todo  @return {[type]}     Explicit retunr for comments related to the given post
 */
schema.statics.findComments = function(id, callback) {
  return this.model('Comment').find({
    post: id
  }, callback);
};

/**
 * Model-based function for updating a given post 
 * @type {function}
 * @param  {object}   req      Request
 * @param  {function} callback Callback
 * @todo @return {[type]}            error or callback
 */
schema.statics.edit = function(req, callback)  {
  var id = req.param('id');
  var author = req.session.user;
  var query = {
    _id: id,
    author: author
  };
  var update = {};
  update.title = req.param('title');
  update.body = req.param('body');

  this.update(query, update, function(err, numAffected) {
    if (err) {
      return callback(err);
    }

    if (0 === numAffected) {
      return callback(new Error('no posts affedted'));
    }
    
    callback();
  });
};

/**
 * Exports
 * @type {function}
 */
module.exports = mongoose.model('Posts', schema);