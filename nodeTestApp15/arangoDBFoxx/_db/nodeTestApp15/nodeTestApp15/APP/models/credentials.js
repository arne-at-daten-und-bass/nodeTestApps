'use strict';

var Foxx = require('org/arangodb/foxx');
var Joi = require('joi');

module.exports = Foxx.Model.extend({
  schema: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
});