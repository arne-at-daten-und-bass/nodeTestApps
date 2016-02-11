'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  graph: function(req, res) {
    var query = neo.graph.readAllQuery();
    var params = {};
    
    resultType = ["graph"];

    function callback(error, response) {
      var graph = {};
      graph = neo.helpers.nodeLinks(error, response) ;
      
      res.json({
        slogan: 'Visual',
        graph: graph
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  }

}
