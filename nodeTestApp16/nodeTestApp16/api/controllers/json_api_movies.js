'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  create: function(req, res) {
    var query = neo.queries.movies().create();
    // var query = neo.movies.createQuery();
    var params = neo.params.movies().create(req.swagger.params.movie.value.movie.title, req.swagger.params.movie.value.movie.released, req.swagger.params.movie.value.movie.tagline);
    // var params = req.swagger.params.movie.title.value;

    var callback = neo.callbacks.movies.create(res).api;
    // var callback = neo.callbacks.movies(res).createViaAPI;
    // function callback(error, responseBody) {
    //   res.json({
    //     movie: responseBody.results[0].data 
    //   });
    // }

    neo.requests.movies().create(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);  
  },

  readBulk: function(req, res) {
    var query = neo.queries.movies().readBulkParam();
    // var query = neo.movies.queries().readBulkParam();
    var params = neo.params.movies().readBulkParam(req.swagger.params.released.value);
    // var params = {
    //   'released': parseInt(req.swagger.params.released.value)
    // };
    if(req.swagger.params.released.value === undefined) {
      query = neo.queries.movies().readBulkNoParam();
    }  

    var callback = neo.callbacks.movies.readBulk(res).api;
    // var callback = neo.callbacks.movies(res).readBulkViaAPI;
    // function callback(error, responseBody) {
    //   var movies = [];
    //   movies = neo.helpers.readBulk(error, responseBody);

    //   res.json({
    //     movies:  movies
    //   });
    // }

    neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.queries.movies().read();
    // var query = neo.movies.queries().read();
    var params = neo.params.movies().read(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 

    var callback = neo.callbacks.movies.read(res).api;
    // function callback(error, responseBody){
    //   res.json({
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.requests.movies().read(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.queries.movies().update();
    // var query = neo.movies.queries().update();
    var params = neo.params.movies().update(req.swagger.params.movieId.value, req.swagger.params.movie.value.movie.title, req.swagger.params.movie.value.movie.released, req.swagger.params.movie.value.movie.tagline);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value),
    //   'props': req.swagger.params.movie.value.movie
    //   }; 

    var callback = neo.callbacks.movies.update(res).api;
    // function callback(error, responseBody) {
    //   res.json({
    //     movie: responseBody.results[0].data
    //   });
    // }   

    neo.requests.movies().update(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.queries.movies().delete();
    // var query = neo.movies.queries().delete();
    var params = neo.params.movies().delete(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // };
    
    includeStats = true;

    var callback = neo.callbacks.movies.delete(res).api;
    // function callback(error, responseBody) {
    //   res.json({
    //     nodes_deleted: responseBody.results[0].stats.nodes_deleted
    //   });
    // }

    neo.requests.movies().delete(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};