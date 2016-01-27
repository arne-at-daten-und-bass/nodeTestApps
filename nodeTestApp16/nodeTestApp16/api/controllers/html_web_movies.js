'use strict';

var neo = require('../helpers/neo');

var includeStats = false;

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
    var query = neo.createQuery;
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

      res.render('movies/readBulk', {
        slogan: 'All The Movies',
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
      res.render('movies/read', {
        slogan: 'Movie',
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, includeStats, callback);
  },

  getUpdate: function(req, res) {
    var query = neo.getUpdateQuery;
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

    neo.cypherRequest(query, params, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.updateQuery;
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

    neo.cypherRequest(query, params, includeStats, callback);
  },

  getDelete: function(req, res) {
    var query = neo.getDeleteQuery;
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

    neo.cypherRequest(query, params, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.deleteQuery;
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

    neo.cypherRequest(query, params, includeStats, callback);   
  }

};