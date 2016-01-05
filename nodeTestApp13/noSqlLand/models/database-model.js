/**
 * Requirements
 * @type {object}
 * @todo intgrate lookup for associated posts (comparable to comments on posts)
 */
var mongoose = require('mongoose');

/**
 * Mongoose schema definition for database entities
 * @type {object}
 */
var schema = mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  description: String,
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
 * Exports
 * @type {function}
 */
module.exports = mongoose.model('Databases', schema);