'use strict';

var environment = function() {
  return process.env.NODE_ENV || 'development';
};

var context = require('./context_' + environment());

module.exports = context;
