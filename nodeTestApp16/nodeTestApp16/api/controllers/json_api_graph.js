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

    readGraphOfMovie: function(req, res) {
      console.log(req.swagger.params);

      var query = that.queries.readGraphOfMovie;
      var params = {id: req.swagger.params.id.value};
      var callback = that.callbacks.graph(res, '', '', '', 'readGraphOfMovie').api;

      resultType = ["graph"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    readGraphOfPerson: function(req, res) {
      console.log(req.swagger.params);

      var query = that.queries.readGraphOfPerson;
      var params = {id: req.swagger.params.id.value};
      var callback = that.callbacks.graph(res, '', '', '', 'readGraphOfPerson').api;

      resultType = ["graph"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    readLabelsAmountNodes: function(req, res) {
      var query = that.queries.search.readLabelsAmountNodes;
      var params = {};
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'readLabelsAmountNodes').api;

      resultType = ["row"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    readTypeAmountRelationships: function(req, res) {
      var query = that.queries.search.readTypeAmountRelationships;
      var params = {};
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'readTypeAmountRelationships').api;

      resultType = ["row"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    readAllRelationshipsPagination: function(req, res) {
      var query = that.queries.search.readAllRelationshipsPagination;
      var params = {offset: req.swagger.params.pagination.value, amount: 6};
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'readAllRelationshipsPagination').api;

      resultType = ["row"];

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

    readCastMovie: function(req, res) {
      var query = that.queries.search.readCastMovie;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'readCastMovie').api;

      resultType = ["row"];

      console.log(req.swagger.params);

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    readTopColleagues: function(req, res) {
      var relationshipName = req.swagger.params.relationshipName.value;

      var query = that.queries.search.readTopColleagues[relationshipName];
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'readTopColleagues').api;

      resultType = ["row"];

      console.log(req.swagger.params);

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

  };
};

module.exports = jsonApiGraph;
