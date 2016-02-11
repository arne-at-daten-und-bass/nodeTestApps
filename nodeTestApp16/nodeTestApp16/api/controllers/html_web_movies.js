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
    var query = neo.queries.movies().create();
    var params = neo.params.movies().create(req.swagger.params.title.value, req.swagger.params.released.value, req.swagger.params.tagline.value);
    // {
    //   'title': req.swagger.params.title.value,
    //   'released': parseInt(req.swagger.params.released.value),
    //   'tagline': req.swagger.params.tagline.value
    // };
    
    var callback = neo.callbacks.movies.create(res).web;
    // var callback = neo.callbacks.movies(res).create;
    // function callback(error, responseBody) {
    //   res.render('movies/read', {
    //     slogan: 'New Movie created',
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.requests.movies().create(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }, 

  readBulk: function(req, res) {
    var query = neo.queries.movies().readBulkParam();
    var params = neo.params.movies().readBulkParam(req.swagger.params.released.value);
    // var params = {
    //   'released': parseInt(req.swagger.params.released.value)
    // };
    if(req.swagger.params.released.value === undefined) {
      query = neo.queries.movies().readBulkNoParam();
    }  

    var callback = neo.callbacks.movies.readBulk(res).web;
    // var callback = neo.callbacks.movies(res).readBulk;
    // function callback(error, responseBody) {
    //   var movies = [];
    //   movies = neo.helpers.readBulk(error, responseBody);

    //   res.render('movies/readBulk', {
    //     slogan: 'All The Movies',
    //     movies: movies
    //   });
    // }

    neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.queries.movies().read();
    var params = neo.params.movies().read(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 

    var callback = neo.callbacks.movies.read(res).web;
    // var callback = neo.callbacks.movies(res).read;
    // function callback(error, responseBody){
    //   res.render('movies/read', {
    //     slogan: 'Movie',
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.requests.movies().read(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getUpdate: function(req, res) {
    var query = neo.queries.movies().getUpdate();
    var params = neo.params.movies().getUpdate(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 
    
    var callback = neo.callbacks.movies.getUpdate(res).web;
    // var callback = neo.callbacks.movies(res).getUpdate;
    // function callback(error, responseBody){
    //   res.render('movies/update', { 
    //     slogan: 'Update a Movie',
    //     id: parseInt(req.swagger.params.movieId.value),
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.requests.movies().getUpdate(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.queries.movies().update();
    var params = neo.params.movies().update(req.swagger.params.movieId.value, req.swagger.params.title.value, req.swagger.params.released.value, req.swagger.params.tagline.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value),
    //   'props': {
    //     'title': req.swagger.params.title.value,
    //     'released': parseInt(req.swagger.params.released.value),
    //     'tagline': req.swagger.params.tagline.value
    //     }
    //   };

    var callback = neo.callbacks.movies.update(res).web;
    // var callback = neo.callbacks.movies(res).update;
    // function callback(error, responseBody) {
    //   res.render('movies/read', {
    //     slogan: 'Movie updated',
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }   

    neo.requests.movies().update(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getDelete: function(req, res) {
    var query = neo.queries.movies().getDelete();
    var params = neo.params.movies().getDelete(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 

    var callback = neo.callbacks.movies.getDelete(res).web;
    // var callback = neo.callbacks.movies(res).getDelete;
    // function callback(error, responseBody){
    //   res.render('movies/delete', { 
    //     slogan: 'Delete a Movie (and all its relationships)',
    //     id: parseInt(req.swagger.params.movieId.value),
    //     movie: responseBody.results[0].data[0].row[0]
    //   });
    // }

    neo.requests.movies().getDelete(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.queries.movies().delete();
    var params = neo.params.movies().delete(req.swagger.params.movieId.value);
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value)
    // }; 
    
    includeStats = true;

    var callback = neo.callbacks.movies.delete(res).web;
    // var callback = neo.callbacks.movies(res).delete;
    // function callback(error, responseBody) {
    //   res.render('movies/deleted', {
    //     slogan: 'Amount of deleted movies',
    //     nodes_deleted: responseBody.results[0].stats.nodes_deleted
    //   });
    // }

    neo.requests.movies().delete(query, params, resultType, includeStats, callback);
    // neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};