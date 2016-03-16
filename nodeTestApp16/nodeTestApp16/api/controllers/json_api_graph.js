'use strict';

// JSON only API:
var jsonApiGraph = function () {
  var that = this;  

  var includeStats = false;
  var resultType = ["row"];

  return {
    readAllGraph: function(req, res) {
      var query = that.queries.readAllGraph;
      var params = {};
      var callback = that.callbacks.graph(res, '', '', '', 'readGraph').api;

      resultType = ["graph"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },
    readTopPersons: function(req, res) {
      var relationshipName = req.swagger.params.relationshipName.value;

      var query = that.queries.search.readTopPersons[relationshipName];
      var params = {};
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'readTopPersons').api;

      resultType = ["row"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

  };
};

module.exports = jsonApiGraph;
