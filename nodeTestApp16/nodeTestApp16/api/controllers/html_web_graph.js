'use strict';

// var neo = require('../helpers/neo');

// HTML Web:
var htmlWebGraph = function (localesUtils) {
  var that = this;

  var locale = localesUtils.getDefaultLocale(); 
  var locales = localesUtils.setLocales('noLocale', locale, that.strings);

  var includeStats = false;
  var resultType = ["row"];

  return {
    getCreate: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query0 = that.queries.readAllPersons;
      // var query0 = neo.graph.readAllPersonsQuery;
      var params0 = {};
      var query1 = that.queries.readAllMovies;
      // var query1 = neo.graph.readAllMoviessQuery;
      var params1 = {};

      var callback = that.callbacks.graph(res, '', that.templateFolder + '/create', locales, 'getCreate', '', that.relationshipTypes).web;
      // function callback(error, responseBody){
      //   // console.log(JSON.stringify(responseBody));

      //   res.render('graph/create', { 
      //     slogan: 'Create a new Relationship',
      //     persons: responseBody[0].body.data,
      //     relationships: neo.graph.allRelationshipTypes,
      //     movies: responseBody[1].body.data
      //   });
      // }

      that.requests.cypherBatch(query0, params0, query1, params1, callback);
      // neo.cypherBatch(query0, params0, query1, params1, callback);
    },

    create: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query;
      switch(req.swagger.params.type.value){
        case "ACTED_IN": 
          query = that.queries.create_ACTED_IN; break;
          // query = neo.graph.create_ACTED_IN_Query; break;
        case "DIRECTED":
          query = that.queries.create_DIRECTED; break;
          // query = neo.graph.create_DIRECTED_Query; break;
        case "FOLLOWS":
          query = that.queries.create_FOLLOWS; break;
          // query = neo.graph.create_FOLLOWS_Query;  break;
        case "PRODUCED":
          query = that.queries.create_PRODUCED; break;
          // query = neo.graph.create_PRODUCED_Query; break;
        case "REVIEWED":
          query = that.queries.create_REVIEWED; break;
          // query = neo.graph.create_REVIEWED_Query; break;
        case "WROTE":
          query = that.queries.create_WROTE; break;
          // query = neo.graph.create_WROTE_Query;    break;
        default:
          query = "Empty Query";
      }

      var params = that.params.otherParams.set(req.swagger.params);
      // var params = {
      //   'source': req.swagger.params.source.value,
      //   'type': req.swagger.params.type.text,
      //   'target': req.swagger.params.target.value,
      //   'property': req.swagger.params.property.value
      // };

      resultType = ["row", "graph"];

      var callback = that.callbacks.graph(res, '', that.templateFolder + '/read', locales, 'create').web;
      // function callback(error, responseBody) {
      //   console.log(JSON.stringify(responseBody));
      //   res.render('graph/read', {
      //     slogan: 'New Relationship created',
      //     relationship: responseBody.results[0].data[0]
      //   });
      // }

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
      // neo.cypherRequest(query, params, resultType, includeStats, callback);   
    }
  }; 
};

module.exports = htmlWebGraph;
