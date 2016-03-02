'use strict';

var htmlWebIndex = {
  index: function(req, res) {
    var locale = req.acceptsLanguages( 'en', 'es', 'de', 'fr' );
    if (locale) {
      res.redirect('/' + locale);
    } else {
      res.redirect('/en'); // @TODO: Move locale (enum) to app or context config
    }
  },

  index_locale: function(req, res) {
    res.render('index', 
      { slogan: 'Movie World' 
    });  
  },
}

module.exports = htmlWebIndex;