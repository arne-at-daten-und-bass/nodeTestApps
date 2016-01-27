'use strict';

var neo = require('../helpers/neo');

var includeStats = false;

// JSON only API:
module.exports = {

  create: function(req, res) {
    var query = neo.createQuery;
    var params = req.swagger.params.movie.value.movie;

    function callback(error, responseBody) {
      res.json({
        movie: responseBody.results[0].data 
      });
    }

    neo.cypherRequest(query, params, includeStats, callback);  
  },

  readBulk: function(req, res) {
    var query = neo.readBulkQueryParam;
    var params = {
      'released': parseInt(req.swagger.params.released.value)
    };
    if(req.swagger.params.released.value === undefined) {
      query = neo.readBulkQueryNoParam;
    }  

    function callback(error, responseBody) {
      var dataFromNeo4j = [];
      var dataToSwagger = [];
      
      dataFromNeo4j = responseBody.results[0].data;
      dataFromNeo4j.map(function (element, index) {
        dataToSwagger[index] = element.row;
      });

      res.json({
        movies: dataToSwagger
      });
    }

    neo.cypherRequest(query, params, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.readQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 

    function callback(error, responseBody){
      res.json({
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.updateQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value),
      'props': req.swagger.params.movie.value.movie
      }; 

    function callback(error, responseBody) {
      res.json({
        movie: responseBody.results[0].data
      });
    }   

    neo.cypherRequest(query, params, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.deleteQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    };
    
    includeStats = true;

    function callback(error, responseBody) {
      res.json({
        nodes_deleted: responseBody.results[0].stats.nodes_deleted
      });
    }

    neo.cypherRequest(query, params, includeStats, callback);   
  }

};