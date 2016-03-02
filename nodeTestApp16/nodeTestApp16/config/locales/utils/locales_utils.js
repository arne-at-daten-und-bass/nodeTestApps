'use strict';

var locales = {};

var localesUtils = function (localesStrings, localesCommands, localesUnits) {

  return {
    setLocales: function ja(locale, localeOfCurrentReq) {
      
      if (locale !== localeOfCurrentReq) {
        locales.locale = localeOfCurrentReq;
        locales.localesStrings = this.filterStrings(localeOfCurrentReq, localesStrings);
        locales.localesCommands = this.filterStrings(localeOfCurrentReq, localesCommands);
        locales.localesUnits = typeof localesUnits === 'undefined' ? -1 : this.filterStrings(localeOfCurrentReq, localesCommands);
      }    

      return locales;
    },
    filterStrings: function (locale, stringsToFilter) {
      var filteredStrings = {};

      for (var key1 in stringsToFilter ) {
        for(var key2 in stringsToFilter[key1]) {
          if(key2 === locale) {
            filteredStrings[key1] = (!stringsToFilter[key1][locale] || !stringsToFilter[key1][locale][locale.toUpperCase()]) ? stringsToFilter[key1]['en']['EN'] : stringsToFilter[key1][locale][locale.toUpperCase()]; // @TODO: Move locale (enum) to app or context config
          } else if(!stringsToFilter[key1][locale]) {
            filteredStrings[key1] = stringsToFilter[key1]['en']['EN'];
          }
        }
      }

      return filteredStrings;
    }
  };
};

module.exports = localesUtils;