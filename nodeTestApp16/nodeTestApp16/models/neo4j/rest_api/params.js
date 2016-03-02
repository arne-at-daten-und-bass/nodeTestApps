'use strict';

var paramsToNeo = {};

var params = {
  // rm nodeType and instead use forEach over this.properties for every nodeType
  inBodyParams: function() {
    // var paramsToNeo = {};
    return {
      set: function(paramsFromSwagger) { //nodeType
        paramsToNeo = {
          id: typeof paramsFromSwagger.id === 'undefined' ? -1 : parseInt(paramsFromSwagger.id.value),
          released: typeof paramsFromSwagger.released === 'undefined' || typeof paramsFromSwagger.released.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.released.value),
          properties: {
            title: typeof paramsFromSwagger.movie.value.movie.title === 'undefined' ? -1 : paramsFromSwagger.movie.value.movie.title,
            released: typeof paramsFromSwagger.movie.value.movie.released === 'undefined' ? -1  : parseInt(paramsFromSwagger.movie.value.movie.released),
            tagline: typeof paramsFromSwagger.movie.value.movie.tagline === 'undefined' ? -1 : paramsFromSwagger.movie.value.movie.tagline,
          },
        };

        // Object.keys(paramsFromSwagger).forEach(function(key) {
        //   if(key === 'id') { 
        //       paramsToNeo[key] = parseInt(paramsFromSwagger[key].value); 
        //     } else {
        //       paramsToNeo[key] = paramsFromSwagger[key].value;
        //     }
        // });

        // paramsToNeo.properties = {};

        // Object.keys(paramsFromSwagger[nodeType].value[nodeType]).forEach(function(key) {
        //   paramsToNeo.properties[key] = paramsFromSwagger[nodeType].value[nodeType].value;
        // });

        return paramsToNeo;
      },

      get: function() {
        return paramsToNeo;
      },
    };
  },

  otherParams: function() {
    // var paramsToNeo = {};

    return {
      set: function(paramsFromSwagger) {
        // paramsToNeo = {
        //   id: typeof paramsFromSwagger.id === 'undefined' ? -1 : parseInt(paramsFromSwagger.id.value),
        //   released: typeof paramsFromSwagger.released === 'undefined' || typeof paramsFromSwagger.released.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.released.value),
        //   properties: {
        //     title: typeof paramsFromSwagger.title === 'undefined' ? -1 : paramsFromSwagger.title.value,
        //     released: typeof paramsFromSwagger.released === 'undefined' || typeof paramsFromSwagger.released.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.released.value),
        //     tagline: typeof paramsFromSwagger.tagline === 'undefined' ? -1 : paramsFromSwagger.tagline.value,
        //   },
        // };
        
        // change 'released' ref in neq query to 'inQueryParams.released'
        // var that = {};
        paramsToNeo.properties = {};
        Object.keys(paramsFromSwagger).forEach(function(key) {
        // for (var key in paramsFromSwagger ) {
          if(key !== 'locale') {
            if(key === 'id') { 
              paramsToNeo[key] = parseInt(paramsFromSwagger[key].value); 
            } else if (paramsFromSwagger[key].schema.in === 'query' ) {
              paramsToNeo[key] = paramsFromSwagger[key].value;
            } else {
              paramsToNeo.properties[key] = paramsFromSwagger[key].value;
            }
          }
        // }
        });
        console.log(paramsToNeo);
        // console.log(that);

        return paramsToNeo;
      },

      get: function() {
        return paramsToNeo;
      },
    };
  },

  persons: {
    inBodyParams: function() {
      // var paramsToNeo = {};
      return {
        set: function(paramsFromSwagger) {
          paramsToNeo = {
            id: typeof paramsFromSwagger.id === 'undefined' ? -1 : parseInt(paramsFromSwagger.id.value),
            born: typeof paramsFromSwagger.born === 'undefined' || typeof paramsFromSwagger.born.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.born.value),
            properties: {
              name: typeof paramsFromSwagger.person.value.person.name === 'undefined' ? -1 : paramsFromSwagger.person.value.person.name,
              born: typeof paramsFromSwagger.person.value.person.born === 'undefined' ? -1  : parseInt(paramsFromSwagger.person.value.person.born),
            },
          };

          return paramsToNeo;
        },

        get: function() {
          return paramsToNeo;
        },
      };
    },

    otherParams: function() {
      // var paramsToNeo = {};
      return {
        set: function(paramsFromSwagger) {
          paramsToNeo = {
            id: typeof paramsFromSwagger.id === 'undefined' ? -1 : parseInt(paramsFromSwagger.id.value),
            born: typeof paramsFromSwagger.born === 'undefined' || typeof paramsFromSwagger.born.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.born.value),
            properties: {
              name: typeof paramsFromSwagger.name === 'undefined' ? -1 : paramsFromSwagger.name.value,
              born: typeof paramsFromSwagger.born === 'undefined' || typeof paramsFromSwagger.born.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.born.value),
            },
          };

          return paramsToNeo;
        },

        get: function() {
          return paramsToNeo;
        },
      };
    },
  },
};

module.exports = params;
