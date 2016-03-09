'use strict';

var neo = require('../helpers/neo');

// JSON only API:
var jsonApiNodes = function () {
  var that = this;

  var includeStats = false;
  var resultType = ["row"];

  return {

    create: function(req, res) {
      var query = that.queries.create;
      // var query = neo.queries.movies().create();
      var params = that.params.inBodyParams().set(req.swagger.params, that.nodeType);
      // var params = neo.params.inBodyParams.movies(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'create').api;
      // var callback = neo.callbacks.movies.create(res).api;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
      // neo.requests.movies().create(query, params, resultType, includeStats, callback); 
    },

    //@FIX (Maybe a Swagger Bug ... worked with less movies): Not working without Params (Malformed response), but does work with Params given
    readBulk: function(req, res) {
      var query = (req.swagger.params[that.inQueryParams].value) ? that.queries.readBulkParam : that.queries.readBulkNoParam;;
      // var query = neo.queries.movies().readBulkParam();
      var params = (req.swagger.params[that.inQueryParams].value) ? that.params.otherParams().set(req.swagger.params) : {} ;
      // var params = neo.params.otherParams.movies(req.swagger.params);
      // if(typeof req.swagger.params.released.value === 'undefined') {
      //   query = neo.queries.movies().readBulkNoParam();
      //   params = {};
      // } 

      var callback = that.callbacks.nodes(res, that.nodeTypePlural, 'abc', 'def', 'readBulk').api;
      // var callback = neo.callbacks.movies.readBulk(res).api;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
      // neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);
    }, 

    read: function(req, res) {
      var query = that.queries.read;
      // var query = neo.queries.movies().read();
      var params = that.params.otherParams().set(req.swagger.params);
      // var params = neo.params.otherParams.movies(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'read').api;
      // var callback = neo.callbacks.movies.read(res).api;
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
      // neo.requests.movies().read(query, params, resultType, includeStats, callback);
    },

    update: function(req, res) {
      var query = that.queries.update;
      // var query = neo.queries.movies().update();
      var params = that.params.inBodyParams().set(req.swagger.params, that.nodeType);
      // console.log(that.nodeType);
      // var params = neo.params.inBodyParams.movies(req.swagger.params);
       var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'update').api;
      // var callback = neo.callbacks.movies.update(res).api;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
      // neo.requests.movies().update(query, params, resultType, includeStats, callback);
    },

    delete: function(req, res) {
      var query = that.queries.delete;
      // var query = neo.queries.movies().delete();
      var params = that.params.otherParams().set(req.swagger.params);
      // var params = neo.params.otherParams.movies(req.swagger.params);

      includeStats = true;

      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'delete').api;
      // var callback = neo.callbacks.movies.delete(res).api;
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
      // neo.requests.movies().delete(query, params, resultType, includeStats, callback);  
    }
  };
};

module.exports = jsonApiNodes;