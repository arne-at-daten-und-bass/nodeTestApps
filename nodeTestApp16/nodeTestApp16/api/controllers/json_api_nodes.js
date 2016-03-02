'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  create: function(req, res) {
    var query = neo.queries.movies().create();
    var params = neo.params.inBodyParams.movies(req.swagger.params);
    var callback = neo.callbacks.movies.create(res).api;
    neo.requests.movies().create(query, params, resultType, includeStats, callback); 
  },

  readBulk: function(req, res) {
    var query = neo.queries.movies().readBulkParam();
    var params = neo.params.otherParams.movies(req.swagger.params);
    if(typeof req.swagger.params.released.value === 'undefined') {
      query = neo.queries.movies().readBulkNoParam();
      params = {};
    } 

    var callback = neo.callbacks.movies.readBulk(res).api;
    neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.queries.movies().read();
    var params = neo.params.otherParams.movies(req.swagger.params);
    var callback = neo.callbacks.movies.read(res).api;
    neo.requests.movies().read(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.queries.movies().update();
    var params = neo.params.inBodyParams.movies(req.swagger.params);
    var callback = neo.callbacks.movies.update(res).api;
    neo.requests.movies().update(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.queries.movies().delete();
    var params = neo.params.otherParams.movies(req.swagger.params);

    includeStats = true;

    var callback = neo.callbacks.movies.delete(res).api;
    neo.requests.movies().delete(query, params, resultType, includeStats, callback);  
  }

};