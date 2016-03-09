'use strict';

var locales = {};

var localesUtils = function (defaultLocale, localesMenu, localesCommands, localesStrings, localesUnits) {

  return {
    getDefaultLocale: function () {
      return defaultLocale;
    },
    setLocales: function (locale, localeOfCurrentReq) {
      
      if (locale !== localeOfCurrentReq) {
        locales.defaultLocale = defaultLocale;
        locales.locale = localeOfCurrentReq;
        locales.localesMenu = localesMenu;
        locales.localesStrings = this.filterStrings(localeOfCurrentReq, localesStrings);
        locales.localesCommands = this.filterStrings(localeOfCurrentReq, localesCommands);
        locales.localesUnits = typeof localesUnits === 'undefined' ? -1 : this.filterStrings(localeOfCurrentReq, localesCommands);
      }

      // @TODO: Set Slogan for read template here if CRUDTYPE has changed
      // if (crudType !== crudTypeOfCurrentReq) {

      // }    

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