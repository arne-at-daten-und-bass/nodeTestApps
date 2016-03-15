'use strict';

var htmlWebIndex = function (localesUtils) {
  var that = this;

  var locale = localesUtils.getDefaultLocale(); 
  var locales = localesUtils.setLocales('noLocale', locale, that.strings);

  var includeStats = false;
  var resultType = ["row"];

  return {
    index: function(req, res) {
      var guessedLocale = req.acceptsLanguages(that.supportedLocales);

      if (guessedLocale) {
        res.redirect('/' + guessedLocale);
      } else {
        res.redirect(that.defaultLocale);
      }
    },

    index_locale: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      var query = that.movieQueries.search.readLatestFourNodes;
      var params = {};
      var callback = that.callbacks.nodes(res, 'movies', 'index', locales, 'index_locale').web;

      resultType = ["graph"];

      that.requests.cypherRequest(query, params, resultType, includeStats, callback);
    },

    about: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render('service_pages/about', 
        { locale: locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
      });  
    },

    contact: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render('service_pages/contact', 
        { locale: locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
      });  
    },
    
    imprint: function(req, res) {
      locales = localesUtils.setLocales(locale, req.swagger.params.locale.value, that.strings); 
      locale = req.swagger.params.locale.value;

      res.render('service_pages/imprint', 
        { locale: locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
      });  
    },
  };
};

module.exports = htmlWebIndex;