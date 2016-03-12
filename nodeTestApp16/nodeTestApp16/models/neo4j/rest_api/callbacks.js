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

        // console.log(JSON.stringify(crudType));
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
          case 'create':
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
