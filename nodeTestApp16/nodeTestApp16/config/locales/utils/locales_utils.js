'use strict';

var locales = {};

var localesUtils = function (defaultLocale, localesMenu, localesCommands, localesUnits) {

  return {
    getDefaultLocale: function () {
      return defaultLocale;
    },
    // @TODO: Optimize (try a localesStrings check and filtering each language only once at startup and hold refs to it)
    setLocales: function (locale, localeOfCurrentReq, localesStrings) {
      
      if (locale !== localeOfCurrentReq) {
        locales = {};
        locales.defaultLocale = defaultLocale;
        locales.locale = localeOfCurrentReq;
        locales.localesMenu = this.filterStrings(localeOfCurrentReq, localesMenu);
        locales.localesCommands = this.filterStrings(localeOfCurrentReq, localesCommands);
        locales.localesUnits = typeof localesUnits === 'undefined' ? -1 : this.filterStrings(localeOfCurrentReq, localesCommands);
      } 
      locales.localesStrings = this.filterStrings(localeOfCurrentReq, localesStrings);  

      return locales;
    },
    filterStrings: function (locale, stringsToFilter) {
      var filteredStrings = {};

      for (var key1 in stringsToFilter ) {
        for(var key2 in stringsToFilter[key1]) {
          if(key2 === locale) {
            filteredStrings[key1] = (!stringsToFilter[key1][locale] || !stringsToFilter[key1][locale][locale.toUpperCase()]) ? stringsToFilter[key1][defaultLocale][defaultLocale.toUpperCase()] : stringsToFilter[key1][locale][locale.toUpperCase()];
          } else if(!stringsToFilter[key1][locale]) {
            filteredStrings[key1] = stringsToFilter[key1][defaultLocale][defaultLocale.toUpperCase()];
          }
        }
      }

      return filteredStrings;
    }
  };
};

module.exports = localesUtils;