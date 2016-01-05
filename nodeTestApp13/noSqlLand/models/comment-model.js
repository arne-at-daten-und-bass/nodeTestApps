var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  type: {
    type: String,
    enum: ['Users', 'Posts', 'Databases', 'Persons']
  },
  text: {
    type: String,
    trim: true,
    validate: validateText
  },
  referencedEntity: {
    type: ObjectId,
    index: true
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

function validateText(str) {
  return str.length < 250;
}

// disable auto index creation
// schema.set('autoIndex', false);

module.exports = mongoose.model('Comments', schema);