'use strict';

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
      var params0 = {};
      var query1 = that.queries.readAllMovies;
      var params1 = {};

      var callback = that.callbacks.graph(res, '', that.templateFolder + '/create', locales, 'getCreate', '', that.relationshipTypes).web;

      var resultType = ["row"];

      that.requests.cypherBatch(query0, params0, query1, params1, callback);
    },

    create: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;
      
      var query;
      switch(req.swagger.params.type.value){
        case "ACTED_IN": 
          query = that.queries.create_ACTED_IN; break;
        case "DIRECTED":
          query = that.queries.create_DIRECTED; break;
        case "FOLLOWS":
          query = that.queries.create_FOLLOWS; break;
        case "PRODUCED":
          query = that.queries.create_PRODUCED; break;
        case "REVIEWED":
          query = that.queries.create_REVIEWED; break;
        case "WROTE":
          query = that.queries.create_WROTE; break;
        default:
          query = "Empty Query";
      }

      var params = that.params.otherParams.set(req.swagger.params);

      resultType = ["row", "graph"];

      var callback = that.callbacks.graph(res, 'relationship', that.templateFolder + '/read', locales, 'create').web;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback); 
    },

    readRelationship: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.readRelationship;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, '', that.templateFolder + '/read', locales, 'readRelationship', req.swagger.params.id.value, that.relationshipTypes).web;

      var resultType = ["row"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    getUpdateRelationship: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.getUpdateRelationship;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, '', that.templateFolder + '/update', locales, 'getUpdateRelationship', req.swagger.params.id.value, that.relationshipTypes).web;

      var resultType = ["row"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    updateRelationship: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query;
      switch(req.swagger.params.type.value){
        case "ACTED_IN": 
          query = that.queries.update_ACTED_IN; break;
        case "REVIEWED":
          query = that.queries.update_REVIEWED; break;
        case "DIRECTED":
        case "FOLLOWS":
        case "PRODUCED":
        case "WROTE":
          query = "Not allowed"; break;
        default:
          query = "Empty Query";
      }

      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, '', that.templateFolder + '/read', locales, 'updateRelationship', req.swagger.params.id.value, that.relationshipTypes).web;

      var resultType = ["row"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    // getDeleteRelationship: function(req, res) {
    //   locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
    //   locale = req.swagger.params.locale.value;

    //   var query = that.queries.getDeleteRelationship;
    //   var params = that.params.otherParams.set(req.swagger.params);
    //   var callback = that.callbacks.graph(res, '', that.templateFolder + '/delete', locales, 'getDeleteRelationship', req.swagger.params.id.value, that.relationshipTypes).web;

    //   var resultType = ["row", "graph"];

    //   that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    // },

    // deleteRelationship: function(req, res) {
    //   locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
    //   locale = req.swagger.params.locale.value;

    //   var query = that.queries.deleteRelationship;
    //   var params = that.params.otherParams.set(req.swagger.params);
    //   var callback = that.callbacks.graph(res, '', that.templateFolder + '/read', locales, 'deleteRelationship', req.swagger.params.id.value, that.relationshipTypes).web;

    //   var resultType = ["row", "graph"];

    //   that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    // },

    deleteRelationship: function(req, res) {
      var query = that.queries.deleteRelationship;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, that.nodeType, '', '', 'deleteRelationship').web;

      var resultType = ["row"];
      includeStats = true;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    searchBox: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.search.searchBox;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.graph(res, '', that.templateFolder + '/search', locales, 'searchBox').web;

      resultType = ["graph"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },
  }; 
};

module.exports = htmlWebGraph;
