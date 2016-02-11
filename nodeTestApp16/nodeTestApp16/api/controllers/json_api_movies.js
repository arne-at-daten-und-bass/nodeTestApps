'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  create: function(req, res) {
    var query = neo.queries.movies().create();
    var params = neo.params.movies().create(req.swagger.params.movie.value.movie.title, req.swagger.params.movie.value.movie.released, req.swagger.params.movie.value.movie.tagline);
    var callback = neo.callbacks.movies.create(res).api;
    neo.requests.movies().create(query, params, resultType, includeStats, callback); 
  },

  readBulk: function(req, res) {
    var query = neo.queries.movies().readBulkParam();

    if(req.swagger.params.released.value === undefined) {
      query = neo.queries.movies().readBulkNoParam();
    } 

    var params = neo.params.movies().readBulkParam(req.swagger.params.released.value);
    var callback = neo.callbacks.movies.readBulk(res).api;
    neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.queries.movies().read();
    var params = neo.params.movies().read(req.swagger.params.movieId.value);
    var callback = neo.callbacks.movies.read(res).api;
    neo.requests.movies().read(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.queries.movies().update();
    var params = neo.params.movies().update(req.swagger.params.movieId.value, req.swagger.params.movie.value.movie.title, req.swagger.params.movie.value.movie.released, req.swagger.params.movie.value.movie.tagline); 
    var callback = neo.callbacks.movies.update(res).api;
    neo.requests.movies().update(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.queries.movies().delete();
    var params = neo.params.movies().delete(req.swagger.params.movieId.value);

    includeStats = true;

    var callback = neo.callbacks.movies.delete(res).api;
    neo.requests.movies().delete(query, params, resultType, includeStats, callback);  
  }

};