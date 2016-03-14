'use strict';

var callbacks = {  // @TODO: switch order of arguments according to web/api etc  see below also for graph
  nodes: function (res, nodeType, template, locales, crudType, nodeId, inQueryParam) {
    
    return {
      api: function (error, responseBodyFromNeo) {
        var responseObjectToSwagger = {};

        switch (crudType){
          case 'readBulk':
            var nodes = [];
            nodes = callbacks.utils.readBulk(error, responseBodyFromNeo);
            responseObjectToSwagger[nodeType] = nodes;
            // console.log(JSON.stringify(responseObjectToSwagger));
            break;
          case 'delete':
            responseObjectToSwagger = {
              nodes_deleted: responseBodyFromNeo.results[0].stats.nodes_deleted,
            };
            break;
           case 'readDistinct':
              var nodes = [];
              nodes = responseBodyFromNeo.results[0].data[0].row[0]; // callbacks.utils.readBulk(error, responseBodyFromNeo);
              responseObjectToSwagger.distinctValues = nodes;
              // responseObjectToSwagger.inQueryParam = inQueryParam;
              break;
          default:
            responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
        }
        // console.log(JSON.stringify(responseObjectToSwagger));
        return res.json(responseObjectToSwagger);
      },

      web: function (error, responseBodyFromNeo) {
        var responseObjectToSwagger = {
          locale: locales.locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
          localesStrings: locales.localesStrings,
          id: typeof nodeId === 'undefined' ? -1 : parseInt(nodeId),
        };

        switch (crudType){
          case 'create':
            responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['New <Instance> created'];
            responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
            break;
          case 'readBulk':
            var nodes = [];
            nodes = callbacks.utils.readBulk(error, responseBodyFromNeo);
            responseObjectToSwagger[nodeType] = nodes;
            responseObjectToSwagger.inQueryParam = inQueryParam;
            responseObjectToSwagger.released = [1975, 1986, 1990, 1992, 1993, 1995, 1996, 1997, 1998, 1999, 2000, 2003, 2004, 2006, 2007, 2008, 2009, 2012];
            responseObjectToSwagger.born = [1929, 1930, 1931, 1932, 1933, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1980, 1981, 1982, 1985, 1996];
            break;
          case 'read':
            responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['<Instance>'];
            responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
            break;
          case 'update':
            responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['<Instance> updated'];
            responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
            break;
          case 'delete':
            var deletedNodeProperties = {};
            deletedNodeProperties = callbacks.utils.getDeletedNodeProperties(error, responseBodyFromNeo);
            
            responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['<Instance> Deleted'];
            responseObjectToSwagger.nodes_deleted = responseBodyFromNeo.results[0].stats.nodes_deleted;
            responseObjectToSwagger[nodeType] = deletedNodeProperties;
            break;
          case 'index_locale':
            var nodes = [];
            nodes = callbacks.utils.readBulk(error, responseBodyFromNeo);
            responseObjectToSwagger[nodeType] = nodes;
            break;
          default:
            responseObjectToSwagger[nodeType] = responseBodyFromNeo.results[0].data[0].row[0];
        }
        // console.log(JSON.stringify(responseObjectToSwagger));
        return res.render(template, responseObjectToSwagger);
      },
    };
  },
  graph: function (res, nodeType, template, locales, crudType, nodeId, relationshipTypes) {
    
    return {
      api: function (error, responseBodyFromNeo) {
        var responseObjectToSwagger = {};

        switch (crudType) {
          case 'readGraph':
            responseObjectToSwagger.graph = callbacks.utils.nodeLinks(error, responseBodyFromNeo);
            break;
          default:
            console.log('Default case.');
        }

        return res.json(responseObjectToSwagger);
      },
      web: function (error, responseBodyFromNeo) {
        var responseObjectToSwagger = {
          locale: locales.locale,
          localesMenu: locales.localesMenu,
          localesCommands: locales.localesCommands,
          localesStrings: locales.localesStrings,
          id: typeof nodeId === 'undefined' ? -1 : parseInt(nodeId),
        };

        switch (crudType) {
          case 'getCreate':
            responseObjectToSwagger.persons = responseBodyFromNeo[0].body.data;
            responseObjectToSwagger.relationships = relationshipTypes;
            responseObjectToSwagger.movies = responseBodyFromNeo[1].body.data;
            break;
          case 'create':
            responseObjectToSwagger.slogan = responseObjectToSwagger.localesStrings['New Relationship created'];
            responseObjectToSwagger.relationship = responseBodyFromNeo.results[0].data[0];
            break;
          default:
            console.log('Default case.');
        }

        return res.render(template, responseObjectToSwagger);
      },
    };
  },
  utils: {
    readBulk: function(error, responseBodyFromNeo) {
      var dataFromNeo4j = [];
      var dataToSwagger = [];

      dataFromNeo4j = responseBodyFromNeo.results[0].data;
      dataFromNeo4j.map(function(element, index) {
        dataToSwagger[index] = element.row[0];
      });

      return dataToSwagger;
    },

    idIndex: function(array, id) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return i;
        }
      }

      return null;
    },

    nodeLinks: function(error, response) {
      var nodes = [];
      var links = [];

      response.results[0].data.forEach(function(row) {

        row.graph.nodes.forEach(function(n) {
          if (callbacks.utils.idIndex(nodes, n.id) === null) {
            if (n.labels[0] === 'Movie') {
              nodes.push({
                id: n.id,
                label: n.labels[0],
                title: n.properties.title,
                tagline: n.properties.tagline,
                released: n.properties.released,
              });
            }

            if (n.labels[0] === 'Person') {
              nodes.push({
                id: n.id,
                label: n.labels[0],
                name: n.properties.name,
                born: n.properties.born,
              });
            }
          }
        });

        links = links.concat(row.graph.relationships.map(function(r) {
          return {
            source: callbacks.utils.idIndex(nodes, r.startNode),
            target: callbacks.utils.idIndex(nodes, r.endNode),
            value: r.type,
          };
        }));
      });

      return { nodes:nodes, links:links };
    },
    getDeletedNodeProperties: function (error, responseBodyFromNeo) {
      var dataFromNeo4jColumns = [];
      var dataFromNeo4jRows = [];
      var dataToSwagger = {};

      dataFromNeo4jColumns = responseBodyFromNeo.results[0].columns;
      dataFromNeo4jRows = responseBodyFromNeo.results[0].data[0].row;
      dataFromNeo4jRows.forEach(function(value, index) {        
        dataToSwagger[dataFromNeo4jColumns[index]] = dataFromNeo4jRows[index];
      });
      return dataToSwagger;
    },
  },
};

module.exports = callbacks;
