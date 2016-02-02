'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// HTML Web:
module.exports = {

  index: function(req, res) {
    res.render('index', 
      { slogan: 'Movie World' 
    });  
  },

  getCreate: function(req, res) {
    res.render('movies/create', 
      { slogan: 'Create a new Movie' 
    });  
  },

  create: function(req, res) {
    var query = neo.movies.createQuery;
    var params = {
      'title': req.swagger.params.title.value,
      'released': parseInt(req.swagger.params.released.value),
      'tagline': req.swagger.params.tagline.value
    };

    function callback(error, responseBody) {
      res.render('movies/read', {
        slogan: 'New Movie created',
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }, 

  readBulk: function(req, res) {
    var query = neo.movies.readBulkQueryParam;
    var params = {
      'released': parseInt(req.swagger.params.released.value)
    };
    if(req.swagger.params.released.value === undefined) {
      query = neo.movies.readBulkQueryNoParam;
    }  

    function callback(error, responseBody) {
      var movies = [];
      movies = neo.helpers.readBulk(error, responseBody);

      res.render('movies/readBulk', {
        slogan: 'All The Movies',
        movies: movies
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.movies.readQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 

    function callback(error, responseBody){
      res.render('movies/read', {
        slogan: 'Movie',
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getUpdate: function(req, res) {
    var query = neo.movies.getUpdateQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 

    function callback(error, responseBody){
      res.render('movies/update', { 
        slogan: 'Update a Movie',
        id: parseInt(req.swagger.params.movieId.value),
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.movies.updateQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value),
      'props': {
        'title': req.swagger.params.title.value,
        'released': parseInt(req.swagger.params.released.value),
        'tagline': req.swagger.params.tagline.value
        }
      };

    function callback(error, responseBody) {
      res.render('movies/read', {
        slogan: 'Movie updated',
        movie: responseBody.results[0].data[0].row[0]
      });
    }   

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getDelete: function(req, res) {
    var query = neo.movies.getDeleteQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 

    function callback(error, responseBody){
      res.render('movies/delete', { 
        slogan: 'Delete a Movie',
        id: parseInt(req.swagger.params.movieId.value),
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.movies.deleteQuery;
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 
    
    includeStats = true;

    function callback(error, responseBody) {
      res.render('movies/deleted', {
        slogan: 'Amount of deleted movies',
        nodes_deleted: responseBody.results[0].stats.nodes_deleted
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};