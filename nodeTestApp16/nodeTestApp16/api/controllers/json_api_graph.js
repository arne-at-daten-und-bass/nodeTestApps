'use strict';

// JSON only API:
var jsonApiGraph = function () {
  var that = this;  

  var includeStats = false;
  var resultType = ["row"];

  return {
    readGraph: function(req, res) {
      var query = that.queries.readAllGraph;
      var params = {};
      var callback = that.callbacks.graph(res, '', '', '', 'readGraph').api;

      resultType = ["graph"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },
  };
};

module.exports = jsonApiGraph;
