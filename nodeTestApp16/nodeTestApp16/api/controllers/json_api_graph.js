'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  readGraph: function(req, res) {
    var query = neo.graph.readAllQuery;
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

    neo.requests.movies().readBulk(query, params, resultType, includeStats, callback);;
  }

}
