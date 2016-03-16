'use strict';

// JSON only API:
var jsonApiNodes = function () {
  var that = this;

  var includeStats = false;
  var resultType = ["row"];

  return {

    create: function(req, res) {
      var query = that.queries.create;
      var params = that.params.inBodyParams.set(req.swagger.params, that.nodeType);
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'create').api;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    //@FIX (Maybe a Swagger Bug ... worked with less movies): Not working without Params (Malformed response), but does work with Params given
    readBulk: function(req, res) {
      var query = (req.swagger.params[that.inQueryParams].value) ? that.queries.readBulkParam : that.queries.readBulkNoParam;;
      var params = (req.swagger.params[that.inQueryParams].value) ? that.params.otherParams.set(req.swagger.params) : {} ;
      var callback = that.callbacks.nodes(res, that.nodeTypePlural, 'abc', 'def', 'readBulk').api;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    }, 

    read: function(req, res) {
      var query = that.queries.read;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'read').api;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    update: function(req, res) {
      var query = that.queries.update;
      var params = that.params.inBodyParams.set(req.swagger.params, that.nodeType);
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'update').api;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    delete: function(req, res) {
      var query = that.queries.delete;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'delete').api;

      includeStats = true;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    readDistinct: function(req, res) {
      var propertyName = req.swagger.params.propertyName.value;

      var query = that.queries.readDistinct[propertyName];
      var params = {};
      var callback = that.callbacks.nodes(res, that.nodeType, '', '', 'readDistinct').api;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },
  };
};

module.exports = jsonApiNodes;