'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// HTML Web:
module.exports = {

  getCreate: function(req, res) {
    var query0 = neo.graph.readAllPersonsQuery;
    var params0 = {};
    var query1 = neo.graph.readAllMoviessQuery;
    var params1 = {};


    function callback(error, responseBody){
      // console.log(JSON.stringify(responseBody));

      res.render('graph/create', { 
        slogan: 'Create a new Relationship',
        persons: responseBody[0].body.data,
        relationships: neo.graph.allRelationshipTypes,
        movies: responseBody[1].body.data
      });
    }

    neo.cypherBatch(query0, params0, query1, params1, callback);

  },

  create: function(req, res) {
    var query;
    switch(req.swagger.params.type.value){
      case "ACTED_IN": 
        query = neo.graph.create_ACTED_IN_Query; break;
      case "DIRECTED":
        query = neo.graph.create_DIRECTED_Query; break;
      case "FOLLOWS":
        query = neo.graph.create_FOLLOWS_Query;  break;
      case "PRODUCED":
        query = neo.graph.create_PRODUCED_Query; break;
      case "REVIEWED":
        query = neo.graph.create_REVIEWED_Query; break;
      case "WROTE":
        query = neo.graph.create_WROTE_Query;    break;
      default:
        query = "Empty Query";
    }

    var params = {
      'source': req.swagger.params.source.value,
      'type': req.swagger.params.type.text,
      'target': req.swagger.params.target.value,
      'property': req.swagger.params.property.value
    };

    resultType = ["row", "graph"];

    function callback(error, responseBody) {
      console.log(JSON.stringify(responseBody));
      res.render('graph/read', {
        slogan: 'New Relationship created',
        relationship: responseBody.results[0].data[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

  // readBulk: function(req, res) {
  //   var query = neo.movies.readBulkQueryParam;
  //   var params = {
  //     'released': parseInt(req.swagger.params.released.value)
  //   };
  //   if(req.swagger.params.released.value === undefined) {
  //     query = neo.movies.readBulkQueryNoParam;
  //   }  

  //   function callback(error, responseBody) {
  //     var movies = [];
  //     movies = neo.helpers.readBulk(error, responseBody);

  //     res.render('movies/readBulk', {
  //       slogan: 'All The Movies',
  //       movies: movies
  //     });
  //   }

  //   neo.cypherRequest(query, params, resultType, includeStats, callback);
  // }, 

  // read: function(req, res) {
  //   var query = neo.movies.readQuery;
  //   var params = {
  //     'id': parseInt(req.swagger.params.movieId.value)
  //   }; 

  //   function callback(error, responseBody){
  //     res.render('movies/read', {
  //       slogan: 'Movie',
  //       movie: responseBody.results[0].data[0].row[0]
  //     });
  //   }

  //   neo.cypherRequest(query, params, resultType, includeStats, callback);
  // },

  // getUpdate: function(req, res) {
  //   var query = neo.movies.getUpdateQuery;
  //   var params = {
  //     'id': parseInt(req.swagger.params.movieId.value)
  //   }; 

  //   function callback(error, responseBody){
  //     res.render('movies/update', { 
  //       slogan: 'Update a Movie',
  //       id: parseInt(req.swagger.params.movieId.value),
  //       movie: responseBody.results[0].data[0].row[0]
  //     });
  //   }

  //   neo.cypherRequest(query, params, resultType, includeStats, callback);
  // },

  // update: function(req, res) {
  //   var query = neo.movies.updateQuery;
  //   var params = {
  //     'id': parseInt(req.swagger.params.movieId.value),
  //     'props': {
  //       'title': req.swagger.params.title.value,
  //       'released': parseInt(req.swagger.params.released.value),
  //       'tagline': req.swagger.params.tagline.value
  //       }
  //     };

  //   function callback(error, responseBody) {
  //     res.render('movies/read', {
  //       slogan: 'Movie updated',
  //       movie: responseBody.results[0].data[0].row[0]
  //     });
  //   }   

  //   neo.cypherRequest(query, params, resultType, includeStats, callback);
  // },

  // getDelete: function(req, res) {
  //   var query = neo.movies.getDeleteQuery;
  //   var params = {
  //     'id': parseInt(req.swagger.params.movieId.value)
  //   }; 

  //   function callback(error, responseBody){
  //     res.render('movies/delete', { 
  //       slogan: 'Delete a Movie',
  //       id: parseInt(req.swagger.params.movieId.value),
  //       movie: responseBody.results[0].data[0].row[0]
  //     });
  //   }

  //   neo.cypherRequest(query, params, resultType, includeStats, callback);
  // },

  // delete: function(req, res) {
  //   var query = neo.movies.deleteQuery;
  //   var params = {
  //     'id': parseInt(req.swagger.params.movieId.value)
  //   }; 
    
  //   includeStats = true;

  //   function callback(error, responseBody) {
  //     res.render('movies/deleted', {
  //       slogan: 'Amount of deleted movies',
  //       nodes_deleted: responseBody.results[0].stats.nodes_deleted
  //     });
  //   }

  //   neo.cypherRequest(query, params, resultType, includeStats, callback);   
  // }

};