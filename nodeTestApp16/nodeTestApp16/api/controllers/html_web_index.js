'use strict';

var htmlWebIndex = function () {
  var that = this;

  return {
    index: function(req, res) {
      // var locale = req.acceptsLanguages( 'en', 'es', 'de', 'fr' );
      var locale = req.acceptsLanguages(that.supportedLocales);
      if (locale) {
        res.redirect('/' + locale);
      } else {
        res.redirect(that.defaultLocale);
      }
    },

    index_locale: function(req, res) {
      res.render('index', 
        { slogan: 'Movie World' 
      });  
    },
  };
};

module.exports = htmlWebIndex;