/**
 * Requirements
 * @type {object}
 */
var mongoose = require('mongoose');

/**
 * Mongoose schema definition for users (which are nor persons)
 * @type {object}
 */
var schema = mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true
  },
  name: {
    first: String,
    last: String
  },
  salt: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Mongoose virtual document property for full name
 * @type {function}
 * @param  {[type]} name Name for virtual property
 * @return {string} Explicit return for this.fullname
 */
schema.virtual('fullname').get(function() {
  return this.name.first + ' ' + this.name.last;
});

/**
 * Exports
 * @type {function}
 */
module.exports = mongoose.model('Users', schema);