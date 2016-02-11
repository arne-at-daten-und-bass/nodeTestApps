'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];


// HTML Web:
module.exports = {

  // index: function(req, res) {
  //   res.render('index', 
  //     { slogan: 'Movie World' 
  //   });  
  // },

  getCreate: function(req, res) {
    res.render('movies/create', 
      { slogan: 'Create a new Movie' 
    });  
  },

  create: function(req, res) {
    var query = neo.movies.queries().create();
    var params = neo.movies.params().create(req.swagger.params.title.value, req.swagger.params.released.value, req.swagger.params.tagline.value);
    // {
    //   'title': req.swagger.params.title.value,
    //   'released': parseInt(req.swagger.params.released.value),
    //   'tagline': req.swagger.params.tagline.value
    // };

    var callback = neo.movies.callbacks(res).create;
    // function callback(error, responseBody) {
    //   res.render('movies/read', {
    //     slogan: 'New Movie created',
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.movies.requests().create(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }, 

  readBulk: function(req, res) {
    var query = neo.movies.queries().readBulkParam();
    var params = neo.movies.params().readBulkParam(req.swagger.params.released.value);
    // var params = {
    //   'released': parseInt(req.swagger.params.released.value)
    // };
    if(req.swagger.params.released.value === undefined) {
      query = neo.movies.queries().readBulkNoParam();
    }  

    var callback = neo.movies.callbacks(res).readBulk;
    // function callback(error, responseBody) {
    //   var movies = [];
    //   movies = neo.helpers.readBulk(error, responseBody);

    //   res.render('movies/readBulk', {
    //     slogan: 'All The Movies',
    //     movies: movies
    //   });
    // }

    neo.movies.requests().readBulk(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.movies.queries().read();
    var params = neo.movies.params().read(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 

    var callback = neo.movies.callbacks(res).read;
    // function callback(error, responseBody){
    //   res.render('movies/read', {
    //     slogan: 'Movie',
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.movies.requests().read(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getUpdate: function(req, res) {
    var query = neo.movies.queries().getUpdate();
    var params = neo.movies.params().getUpdate(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 
    var callback = neo.movies.callbacks(res).getUpdate;
    // function callback(error, responseBody){
    //   res.render('movies/update', { 
    //     slogan: 'Update a Movie',
    //     id: parseInt(req.swagger.params.movieId.value),
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.movies.requests().getUpdate(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.movies.queries().update();
    var params = neo.movies.params().update(req.swagger.params.movieId.value, req.swagger.params.title.value, req.swagger.params.released.value, req.swagger.params.tagline.value)
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value),
    //   'props': {
    //     'title': req.swagger.params.title.value,
    //     'released': parseInt(req.swagger.params.released.value),
    //     'tagline': req.swagger.params.tagline.value
    //     }
    //   };

    var callback = neo.movies.callbacks(res).update;
    // function callback(error, responseBody) {
    //   res.render('movies/read', {
    //     slogan: 'Movie updated',
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }   

    neo.movies.requests().update(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getDelete: function(req, res) {
    var query = neo.movies.queries().getDelete();
    var params = neo.movies.params().getDelete(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 

    var callback = neo.movies.callbacks(res).getDelete;
    // function callback(error, responseBody){
    //   res.render('movies/delete', { 
    //     slogan: 'Delete a Movie (and all its relationships)',
    //     id: parseInt(req.swagger.params.movieId.value),
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.movies.requests().getDelete(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.movies.queries().delete();
    var params = neo.movies.params().delete(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 
    
    includeStats = true;

    var callback = neo.movies.callbacks(res).delete;
    // function callback(error, responseBody) {
    //   res.render('movies/deleted', {
    //     slogan: 'Amount of deleted movies',
    //     nodes_deleted: responseBody.results[0].stats.nodes_deleted
    //   });
    // }

    neo.movies.requests().delete(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};