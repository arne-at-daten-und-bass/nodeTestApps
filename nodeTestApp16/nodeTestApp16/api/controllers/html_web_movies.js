'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];


// HTML Web:
module.exports = {

  getCreate: function(req, res) {
    console.log(JSON.stringify(neo.toString() ));
    res.render('movies/create', 
      { slogan: 'Create a new Movie' 
    });  
  },

  create: function(req, res) {
    var query = neo.queries.movies().create();
    // var params = neo.params.movies().create(req.swagger.params.title.value, req.swagger.params.released.value, req.swagger.params.tagline.value);
    console.log(req.swagger.params);
    var params = neo.params.movies(req.swagger.params);
    var callback = neo.callbacks.movies.create(res).web;
    neo.requests.movies().create(query, params, resultType, includeStats, callback); 
  }, 

  readBulk: function(req, res) {
    var query = neo.queries.movies().readBulkParam();
    console.log(req.swagger.params);
    var params = neo.params.movies(req.swagger.params);

    if(req.swagger.params.released.value === undefined) {
      query = neo.queries.movies().readBulkNoParam();
      params = {};
    }
     
    var callback = neo.callbacks.movies.readBulk(res).web;
    neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.queries.movies().read();
    var params = neo.params.movies(req.swagger.params);
    var callback = neo.callbacks.movies.read(res).web;
    neo.requests.movies().read(query, params, resultType, includeStats, callback);
  },

  getUpdate: function(req, res) {
    var query = neo.queries.movies().getUpdate();
    var params = neo.params.movies(req.swagger.params);
    var callback = neo.callbacks.movies.getUpdate(res).web;
    neo.requests.movies().getUpdate(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.queries.movies().update();
    var params = neo.params.movies(req.swagger.params);
    var callback = neo.callbacks.movies.update(res).web; 
    neo.requests.movies().update(query, params, resultType, includeStats, callback);
  },

  getDelete: function(req, res) {
    var query = neo.queries.movies().getDelete();
    var params = neo.params.movies(req.swagger.params);
    var callback = neo.callbacks.movies.getDelete(res).web;
    neo.requests.movies().getDelete(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.queries.movies().delete();
    var params = neo.params.movies(req.swagger.params);

    includeStats = true;

    var callback = neo.callbacks.movies.delete(res).web;
    neo.requests.movies().delete(query, params, resultType, includeStats, callback);  
  }

};