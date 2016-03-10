'use strict';

// HTML Web Only:
var htmlWebNodes = function (localesUtils) {
  var that = this;

  var locale = localesUtils.getDefaultLocale(); 
  var locales = localesUtils.setLocales('noLocale', locale, that.strings);

  var includeStats = false;
  var resultType = ["row"];

  return {

    getCreate: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render(that.templateFolder + '/create', locales);  
    },

    create: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.create;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, that.templateFolder + '/read', locales, 'create').web; // @TODO: Move crudType (enum) to app or context config or take function name/object literal property 'create'as parameter  (did not work yet because of missing this due to DI)
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    }, 

    readBulk: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = (req.swagger.params[that.inQueryParams].value) ? that.queries.readBulkParam : that.queries.readBulkNoParam;
      var params = (req.swagger.params[that.inQueryParams].value) ? that.params.otherParams.set(req.swagger.params) : {} ;
      var callback = that.callbacks.nodes(res, that.nodeTypePlural, that.templateFolder + '/readBulk', locales, 'readBulk').web;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    }, 

    read: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.read;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, that.templateFolder + '/read', locales, 'read').web;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    getUpdate: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.getUpate;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, that.templateFolder + '/update' , locales, 'getUpdate', that.params.otherParams.get().id).web;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    update: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.update;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, that.templateFolder + '/read', locales, 'update').web;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    getDelete: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.getDelete;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, that.templateFolder + '/delete', locales, 'getDelete', that.params.otherParams.get().id).web;
      
      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    delete: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.queries.delete;
      var params = that.params.otherParams.set(req.swagger.params);
      var callback = that.callbacks.nodes(res, that.nodeType, that.templateFolder + '/read', locales, 'delete').web;
      
      includeStats = true;

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    }
  };
};

module.exports = htmlWebNodes;
