'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  create: function(req, res) {
    var query = neo.movies.createQuery();
    var params = req.swagger.params.movie.value.movie;

    function callback(error, responseBody) {
      res.json({
        movie: responseBody.results[0].data 
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);  
  },

  graph: function(req, res) {
    var query = neo.graph.readAllQuery();
    var params = {};
    
    resultType = ["graph"];

    function callback(error, response) {
      var graph = {};
      graph = neo.helpers.nodeLinks(error, response) ;
      
      res.json({
        slogan: 'Visual',
        graph: graph
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  readBulk: function(req, res) {
    var query = neo.movies.queries().readBulkParam();
    var params = {
      'released': parseInt(req.swagger.params.released.value)
    };
    if(req.swagger.params.released.value === undefined) {
      query = neo.movies.queries().readBulkNoParam();
    }  

    function callback(error, responseBody) {
      var movies = [];
      movies = neo.helpers.readBulk(error, responseBody);

      res.json({
        movies:  movies
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.movies.queries().read();
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 

    function callback(error, responseBody){
      res.json({
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.movies.queries().update();
    var params = {
      'id': parseInt(req.swagger.params.movieId.value),
      'props': req.swagger.params.movie.value.movie
      }; 

    function callback(error, responseBody) {
      res.json({
        movie: responseBody.results[0].data
      });
    }   

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.movies.queries().delete();
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    };
    
    includeStats = true;

    function callback(error, responseBody) {
      res.json({
        nodes_deleted: responseBody.results[0].stats.nodes_deleted
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};