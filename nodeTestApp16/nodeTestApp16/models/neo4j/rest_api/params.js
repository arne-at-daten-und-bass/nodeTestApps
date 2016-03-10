'use strict';

var paramsToNeo = {};

var params = {
  inBodyParams: {
    set: function(paramsFromSwagger, nodeType) {
      paramsToNeo = {};

      Object.keys(paramsFromSwagger).forEach(function(key) {
        if(key === 'id') { 
            paramsToNeo[key] = parseInt(paramsFromSwagger[key].value); 
          } else {
            paramsToNeo[key] = paramsFromSwagger[key].value;
          }
      });

      paramsToNeo.properties = {};

      Object.keys(paramsFromSwagger[nodeType].value[nodeType]).forEach(function(key) {
        paramsToNeo.properties[key] = paramsFromSwagger[nodeType].value[nodeType][key];
      });

      return paramsToNeo;
    },

    get: function() {
      return paramsToNeo;
    },
  },
  otherParams: {
    set: function(paramsFromSwagger) {
      paramsToNeo = {};
      paramsToNeo.properties = {};

      Object.keys(paramsFromSwagger).forEach(function(key) {
        if(key !== 'locale') {
          if(key === 'id') { 
            paramsToNeo[key] = parseInt(paramsFromSwagger[key].value); 
          } else if (key === 'source' || key === 'type' || key === 'target' || key === 'property') {
            paramsToNeo[key] = paramsFromSwagger[key].value;
          } else if (paramsFromSwagger[key].schema.in === 'query' ) {
            paramsToNeo[key] = paramsFromSwagger[key].value;
          } else {
            paramsToNeo.properties[key] = paramsFromSwagger[key].value;
          }
        }
      });

      // console.log(paramsToNeo);
      return paramsToNeo;
    },

    get: function() {
      return paramsToNeo;
    },
  },
};

module.exports = params;
