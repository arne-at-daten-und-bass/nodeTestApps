/**
 * Requirements
 * @type {object}
 */
var mongoose = require('mongoose');

/**
 * Mongoose schema definition for persons (which are not users)
 * @type {object}
 */
var schema = mongoose.Schema({
  name: {
    first: String,
    last: String
  },
  profession: {
    type: String,
    trim: true
  },
  description: String,
  email: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
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
 * Mongoose virtual document property for full name
 * @type   {function}
 * @param  {[type]}   name Name for virtual property
 * @return {string}   Explicit return for this.fullname
 */
schema.virtual('fullname').get(function() {
  return this.name.first + ' ' + this.name.last;
});

/**
 * Exports
 * @type {function}
 */
module.exports = mongoose.model('Persons', schema);