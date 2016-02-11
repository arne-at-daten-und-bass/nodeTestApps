'use strict';

var request = require('request');
var config = require('../../config/');

var headers = {
        'Authorization': process.env.DB_PASS,
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=UTF-8'
      };

var cypherBatchUrl = 'https://' + config.db.ip  + ':' + config.db.https.port +'/db/data/batch';
var cypherBatchJobMethod = 'POST';
var cypherBatchJobUrl = '/cypher';
var cypherBatchId = 0;

var movieCreateQuery = 'CREATE (m:Movie { title: {title}, released: {released}, tagline: {tagline} }) RETURN m';
var movieReadBulkQueryParam = 'MATCH (m:Movie {released: {released}}) RETURN m';
var movieReadBulkQueryNoParam = 'MATCH (m:Movie) RETURN m';
var movieReadQuery = 'MATCH m WHERE id(m)={id} RETURN m';
var movieGetUpdateQuery = 'MATCH m WHERE id(m)={id} RETURN m';
var movieUpdateQuery = 'MATCH m WHERE id(m)={id} SET m={props} RETURN m';
var movieGetDeleteQuery = 'MATCH m WHERE id(m)={id} RETURN m';
var movieDeleteQuery = 'MATCH m WHERE id(m)={id} DETACH DELETE m';

var params = {};

var cypherRequest = function(query, params, resultType, includeStats, callback) {
  console.log(query);
  console.log(JSON.stringify(params));
  request.post({
    headers: headers,
    url: config.db.url,
    ca: config.db.https.caRead,
    json: {statements: [{statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats}]}},
    function(err, res) {
      callback(err, res.body);
    }
  );
};

function readBulk(error, responseBody) {
  var dataFromNeo4j = [];
  var dataToSwagger = [];
  
  dataFromNeo4j = responseBody.results[0].data;
  dataFromNeo4j.map(function (element, index) {
    dataToSwagger[index] = element.row[0];
  });

  return dataToSwagger;
}

module.exports = {

  // cypherRequest: function (query, params, resultType, includeStats, callback) {
  //   console.log(query);
  //   request.post({
  //     headers: headers,
  //     url: config.db.url,
  //     ca: config.db.https.caRead,
  //     json: {statements: [{statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats}]}},
  //     function(err, res) {
  //       callback(err, res.body);
  //     }
  //   );
  // },

  cypherBatch: function (query0, params0, query1, params1, callback) {
    request.post({
      headers: headers,
      url: cypherBatchUrl,
      ca: config.db.https.caRead,
      json: [ {
        'method' : cypherBatchJobMethod,
        'to': cypherBatchJobUrl,
        'body' : {
          'query' : query0,
          'params' : params0
        },
        'id' : cypherBatchId++
      },
      {
        'method' : cypherBatchJobMethod,
        'to': cypherBatchJobUrl,
        'body' : {
          'query' : query1,
          'params' : params1
        },
        'id' : cypherBatchId++}]},
      function(err, res) {
        callback(err, res.body);
      }
    );
  },

  // movies: {
  //   queries: function() {
  queries: {
    movies: function() {
      return {
        create:          function() { return movieCreateQuery; },
        readBulkParam:   function() { return movieReadBulkQueryParam; },
        readBulkNoParam: function() { return movieReadBulkQueryNoParam; },
        read:            function() { return movieReadQuery; },
        getUpdate:       function() { return movieGetUpdateQuery; },
        update:          function() { return movieUpdateQuery; },
        getDelete:       function() { return movieGetDeleteQuery; },
        delete:          function() { return movieDeleteQuery; }
      };
    },
    persons: function() {

    },
    graph: function() {

    }
  },
  params: {
    movies: function() {
      return {
        create: function(title, released, tagline) {
          params = { title: title, released: released, tagline: tagline };      return params; },
        readBulkParam: function(released) {
          params = {released: released };                                       return params; },
        read: function(id) {
          params = { id: parseInt(id) };                                        return params; },
        getUpdate: function(id) {
          params = { id: parseInt(id) };                                        return params; },
        update: function(id, title, released, tagline) {
          params = {id: parseInt(id), props: {title: title, released: released, tagline: tagline} }; return params; },
        getDelete: function(id) {
          params = { id: parseInt(id) };                                        return params; },
        delete: function(id) {
          params = { id: parseInt(id) };                                        return params; }
      };
    },
    persons: function() {

    },
    graph: function() {

    }
  },
  callbacks: {
    movies: { 
      create: function(res) {
        return {
          api: function(error, responseBody) {
            res.json({
              movie: responseBody.results[0].data 
            });
          },          
          web: function(error, responseBody) {
            res.render('movies/read', {
              slogan: 'New Movie created',
              movie: responseBody.results[0].data[0].row[0]
            });
          }
        };
      },
      readBulk: function(res) {
        return { 
          api: function(error, responseBody) {
            var movies = [];
            movies = readBulk(error, responseBody);

            res.json({
              movies:  movies
            });
          }, 
          web: function(error, responseBody) {
            var movies = [];
            movies = readBulk(error, responseBody);

            res.render('movies/readBulk', {
              slogan: 'All The Movies',
              movies: movies
            });
          }
        };
      },
      read: function(res) {
        return {
          api: function(error, responseBody) {
            res.json({
              movie: responseBody.results[0].data[0].row[0]
            });
          },
          web: function(error, responseBody) {
            res.render('movies/read', {
              slogan: 'Movie',
              movie: responseBody.results[0].data[0].row[0]
            });
          }
        };
      },
      getUpdate: function(res) {
        return {
          web: function(error, responseBody) {
            res.render('movies/update', { 
              slogan: 'Update a Movie',
              id: parseInt(params.id),
              movie: responseBody.results[0].data[0].row[0]
            });
          }
        };
      },
      update: function(res) {
        return {
          api: function (error, responseBody) {
            res.json({
              movie: responseBody.results[0].data
            });
          },   
          web: function (error, responseBody) {
            res.render('movies/read', {
              slogan: 'Movie updated',
              movie: responseBody.results[0].data[0].row[0]
            });
          }
        };
      },
      getDelete: function(res) {
        return {
          web: function (error, responseBody){
            res.render('movies/delete', { 
              slogan: 'Delete a Movie (and all its relationships)',
              id: parseInt(params.id),
              movie: responseBody.results[0].data[0].row[0]
            });
          }
        };
      },
      delete: function(res) {
        return { 
          api: function(error, responseBody) {
            res.json({
              nodes_deleted: responseBody.results[0].stats.nodes_deleted
            });
          },        
          web: function (error, responseBody) {
            res.render('movies/deleted', {
              slogan: 'Amount of deleted movies',
              nodes_deleted: responseBody.results[0].stats.nodes_deleted
            });
          }
        };
      }
    },
    persons: function() {

    },
    graph: function() {

    }
  },
  requests: {
    movies: function() {
      return {
        create: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);   
        },
        readBulk: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);
        },
        read: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);
        },
        getUpdate: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);
        },
        update: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);
        },
        getDelete: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);
        },
        delete: function(query, params, resultType, includeStats, callback) {
          cypherRequest(query, params, resultType, includeStats, callback);
        }
      };
    },
    persons: function() {

    },
    graph: function() {

    }
  },

  persons: {
    createQuery: 'CREATE (p:Person { born: {born}, name: {name} }) RETURN p',
    readBulkQueryParam: 'MATCH (p:Person {born: {born}}) RETURN p',
    readBulkQueryNoParam: 'MATCH (p:Person) RETURN p',
    readQuery: 'MATCH p WHERE id(p)={id} RETURN p',
    getUpdateQuery:'MATCH p WHERE id(p)={id} RETURN p',
    updateQuery:'MATCH p WHERE id(p)={id} SET p={props} RETURN p',
    getDeleteQuery: 'MATCH p WHERE id(p)={id} RETURN p',
    deleteQuery: 'MATCH p WHERE id(p)={id} DETACH DELETE p'
  },

  graph: {
    readAllQuery: 'MATCH path = (n)-[r]->(m) RETURN path',
    readAllPersonsQuery: 'MATCH (p:Person) RETURN p.name ORDER BY p.name',
    readAllMoviessQuery: 'MATCH (m:Movie) RETURN m.title ORDER BY m.title',
    allRelationshipTypes: ['ACTED_IN', 'DIRECTED', 'FOLLOWS', 'PRODUCED', 'REVIEWED', 'WROTE'],
    create_ACTED_IN_Query: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:ACTED_IN {roles: [{property}] }]->(m) RETURN p.name, type(r), m.title, r.roles',
    create_DIRECTED_Query: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:DIRECTED]->(m) RETURN p.name, type(r), m.title',
    create_FOLLOWS_Query: 'MATCH (p:Person { name: {source} }), (p2:Person { name: {target} }) CREATE (p)-[r:FOLLOWS]->(p2) RETURN p.name, type(r), p2.name',
    create_PRODUCED_Query: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:PRODUCED]->(m) RETURN p.name, type(r), m.title',
    create_REVIEWED_Query: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:REVIEWED {summary: {property} }]->(m) RETURN p.name, type(r), m.title, r.summary',
    create_WROTE_Query: 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:WROTE]->(m) RETURN p.name, type(r), m.title'
  },

  helpers: {

    readBulk: function callback(error, responseBody) {
      var dataFromNeo4j = [];
      var dataToSwagger = [];
      
      dataFromNeo4j = responseBody.results[0].data;
      dataFromNeo4j.map(function (element, index) {
        dataToSwagger[index] = element.row[0];
      });

      return dataToSwagger;
    },

    idIndex: function (array, id) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return i;
        }
      }
      return null;
    },
    
    nodeLinks: function (error, response) {
      var nodes = [];
      var links = [];

      response.results[0].data.forEach(function (row) {

        row.graph.nodes.forEach(function (n) {
          if(module.exports.helpers.idIndex(nodes, n.id) === null) {
            if(n.labels[0] === 'Movie') {
              nodes.push({
                'id': n.id,
                'label': n.labels[0],
                'title': n.properties.title,
                'tagline': n.properties.tagline,
                'released': n.properties.released
              });
            }
            if(n.labels[0] === 'Person') {
              nodes.push({
                'id': n.id,
                'label': n.labels[0],
                'name': n.properties.name,
                'born': n.properties.born
              });
            }
          }
        });

        links = links.concat(row.graph.relationships.map(function(r) {
          return {
            'source': module.exports.helpers.idIndex(nodes, r.startNode),
            'target': module.exports.helpers.idIndex(nodes, r.endNode),
            'value': r.type
          };
        }));
      });

      return {'nodes':nodes, 'links':links};
    }

  }

};