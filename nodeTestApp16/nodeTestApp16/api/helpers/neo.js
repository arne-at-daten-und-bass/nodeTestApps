 

// var request = require('request');
// // var config = require('../../config/');

// var headers = {
//         'Authorization': process.env.DB_PASS,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json; charset=UTF-8'
//       };

// var cypherBatchUrl = 'https://' + config.db.ip  + ':' + config.db.https.port +'/db/data/batch';
// var cypherBatchJobMethod = 'POST';
// var cypherBatchJobUrl = '/cypher';
// var cypherBatchId = 0;

// var graphArrayOfAllRelationshipTypes = ['ACTED_IN', 'DIRECTED', 'FOLLOWS', 'PRODUCED', 'REVIEWED', 'WROTE'];

// var queriesBuilder = (function () {
//   var movieCreateQuery = 'CREATE (m:Movie {properties}) RETURN m';
//   var movieReadBulkQueryParam = 'MATCH (m:Movie { released: {released} }) RETURN m';
//   var movieReadBulkQueryNoParam = 'MATCH (m:Movie) RETURN m';
//   var movieReadQuery = 'MATCH m WHERE id(m)={id} RETURN m';
//   var movieGetUpdateQuery = 'MATCH m WHERE id(m)={id} RETURN m';
//   var movieUpdateQuery = 'MATCH m WHERE id(m)={id} SET m={properties} RETURN m';
//   var movieGetDeleteQuery = 'MATCH m WHERE id(m)={id} RETURN m';
//   var movieDeleteQuery = 'MATCH m WHERE id(m)={id} DETACH DELETE m';

//   var personCreateQuery = 'CREATE (p:Person {properties}) RETURN p';
//   var personReadBulkQueryParam ='MATCH (p:Person { born: {born} }) RETURN p';
//   var personReadBulkQueryNoParam = 'MATCH (p:Person) RETURN p';
//   var personReadQuery = 'MATCH p WHERE id(p)={id} RETURN p';
//   var personGetUpdateQuery ='MATCH p WHERE id(p)={id} RETURN p';
//   var personUpdateQuery ='MATCH p WHERE id(p)={id} SET p={properties} RETURN p';
//   var personGetDeleteQuery ='MATCH p WHERE id(p)={id} RETURN p';
//   var personDeleteQuery = 'MATCH p WHERE id(p)={id} DETACH DELETE p';

//   var graphReadAllQuery = 'MATCH path = (n)-[r]->(m) RETURN path';
//   var graphReadAllPersonsQuery ='MATCH (p:Person) RETURN p.name ORDER BY p.name';
//   var graphReadAllMoviesQuery = 'MATCH (m:Movie) RETURN m.title ORDER BY m.title';
//   var graphCreate_ACTED_IN_Query = 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:ACTED_IN {roles: [{property}] }]->(m) RETURN p.name, type(r), m.title, r.roles';
//   var graphCreate_DIRECTED_Query = 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:DIRECTED]->(m) RETURN p.name, type(r), m.title';
//   var graphCreate_FOLLOWS_Query = 'MATCH (p:Person { name: {source} }), (p2:Person { name: {target} }) CREATE (p)-[r:FOLLOWS]->(p2) RETURN p.name, type(r), p2.name';
//   var graphCreate_PRODUCED_Query = 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:PRODUCED]->(m) RETURN p.name, type(r), m.title';
//   var graphCreate_REVIEWED_Query = 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:REVIEWED {summary: {property} }]->(m) RETURN p.name, type(r), m.title, r.summary';
//   var graphCreate_WROTE_Query = 'MATCH (p:Person { name: {source} }), (m:Movie { title: {target} }) CREATE (p)-[r:WROTE]->(m) RETURN p.name, type(r), m.title';
  
//   return {
//     movies: {
//       create:          function() { return movieCreateQuery; },
//       readBulkParam:   function() { return movieReadBulkQueryParam; },
//       readBulkNoParam: function() { return movieReadBulkQueryNoParam; },
//       read:            function() { return movieReadQuery; },
//       getUpdate:       function() { return movieGetUpdateQuery; },
//       update:          function() { return movieUpdateQuery; },
//       getDelete:       function() { return movieGetDeleteQuery; },
//       delete:          function() { return movieDeleteQuery; }
//     },
//     persons: {
//       create:          function() { return personCreateQuery; },
//       readBulkParam:   function() { return personReadBulkQueryParam; },
//       readBulkNoParam: function() { return personReadBulkQueryNoParam; },
//       read:            function() { return personReadQuery; },
//       getUpdate:       function() { return personGetUpdateQuery; },
//       update:          function() { return personUpdateQuery; },
//       getDelete:       function() { return personGetDeleteQuery; },
//       delete:          function() { return personDeleteQuery; }
//     },
//     graph: {
//       readAll:                  function() { return graphReadAllQuery; },
//       readAllPersons:           function() { return graphReadAllPersonsQuery; },
//       readAllMovies:            function() { return graphReadAllMoviesQuery; },
//       readAllRelationshipTypes: function() { return graphArrayOfAllRelationshipTypes; },
//       create_ACTED_IN:          function() { return graphCreate_ACTED_IN_Query; },
//       create_DIRECTED:          function() { return graphCreate_DIRECTED_Query; },
//       create_FOLLOWS:           function() { return graphCreate_FOLLOWS_Query; },
//       create_PRODUCED:          function() { return graphCreate_PRODUCED_Query; },
//       create_REVIEWED:          function() { return graphCreate_REVIEWED_Query; },
//       create_WROTE:             function() { return graphCreate_WROTE_Query; }
//     }
//   };
// })();

// var paramsBuilder = (function() {
//   var paramsToNeo = {};
//   return {
//     inBodyParams: { 
//       movies: {
//         set: function(paramsFromSwagger) {
//           console.log(paramsFromSwagger);
//           paramsToNeo = {
//             id: typeof paramsFromSwagger.movieId === 'undefined' ? -1 : parseInt(paramsFromSwagger.movieId.value),
//             released: typeof paramsFromSwagger.released === 'undefined' || typeof paramsFromSwagger.released.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.released.value),
//             properties: { 
//               title: typeof paramsFromSwagger.movie.value.movie.title === 'undefined' ? -1 : paramsFromSwagger.movie.value.movie.title, 
//               released: typeof paramsFromSwagger.movie.value.movie.released === 'undefined' ? -1  : parseInt(paramsFromSwagger.movie.value.movie.released), 
//               tagline: typeof paramsFromSwagger.movie.value.movie.tagline === 'undefined' ? -1 : paramsFromSwagger.movie.value.movie.tagline
//             }
//           };
//           return paramsToNeo;
//         },
//         get: function() {
//           return paramsToNeo;
//         }
//       },
//       persons: { 
//         set: function (paramsFromSwagger) {
//           paramsToNeo = {
//             id: typeof paramsFromSwagger.personId === 'undefined' ? -1 : parseInt(paramsFromSwagger.personId.value),
//             born: typeof paramsFromSwagger.born === 'undefined' || typeof paramsFromSwagger.born.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.born.value),
//             properties: { 
//               name: typeof paramsFromSwagger.person.value.person.name === 'undefined' ? -1 : paramsFromSwagger.person.value.person.name, 
//               born: typeof paramsFromSwagger.person.value.person.born === 'undefined' ? -1  : parseInt(paramsFromSwagger.person.value.person.born) 
//             } 
//           };
//           return paramsToNeo;
//         },
//         get: function () {
//           return paramsToNeo;
//         }
//       }
//     },
//     otherParams: {
//       movies: {
//         set: function(paramsFromSwagger) {
//           paramsToNeo = {
//             id: typeof paramsFromSwagger.movieId === 'undefined' ? -1 : parseInt(paramsFromSwagger.movieId.value),
//             released: typeof paramsFromSwagger.released === 'undefined' || typeof paramsFromSwagger.released.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.released.value),
//             properties: { 
//               title: typeof paramsFromSwagger.title === 'undefined' ? -1 : paramsFromSwagger.title.value, 
//               released: typeof paramsFromSwagger.released === 'undefined' || typeof paramsFromSwagger.released.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.released.value), 
//               tagline: typeof paramsFromSwagger.tagline === 'undefined' ? -1 : paramsFromSwagger.tagline.value
//             }
//           };
//           return paramsToNeo;
//         },
//         get: function() {
//           return paramsToNeo;
//         }
//       },
//       persons: {
//         set: function (paramsFromSwagger) {
//           paramsToNeo = {
//             id: typeof paramsFromSwagger.personId === 'undefined' ? -1 : parseInt(paramsFromSwagger.personId.value),
//             born: typeof paramsFromSwagger.born === 'undefined' || typeof paramsFromSwagger.born.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.born.value),
//             properties: { 
//               name: typeof paramsFromSwagger.name === 'undefined' ? -1 : paramsFromSwagger.name.value, 
//               born: typeof paramsFromSwagger.born === 'undefined' || typeof paramsFromSwagger.born.value === 'undefined' ? -1  : parseInt(paramsFromSwagger.born.value) 
//             } 
//           };
//           return paramsToNeo;
//         },
//         get: function () {
//           return paramsToNeo;
//         }
//       }
//     }
//   };
// })();

// var cypherRequest = function(query, params, resultType, includeStats, callback) {
//   console.log(query);
//   console.log(JSON.stringify(params));
//   request.post({
//     headers: headers,
//     url: config.db.url,
//     ca: config.db.https.caRead, // process.env.DB_HTTPS_CA
//     json: {statements: [{statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats}]}},
//     function(err, res) {
//       callback(err, res.body);
//     }
//   );
// };

// var cypherBatch = function(query0, params0, query1, params1, callback) {
//   request.post({
//     headers: headers,
//     url: cypherBatchUrl,
//     ca: config.db.https.caRead, // process.env.DB_HTTPS_CA
//     json: [ {
//       'method' : cypherBatchJobMethod,
//       'to': cypherBatchJobUrl,
//       'body' : {
//         'query' : query0,
//         'params' : params0
//       },
//       'id' : cypherBatchId++
//     },
//     {
//       'method' : cypherBatchJobMethod,
//       'to': cypherBatchJobUrl,
//       'body' : {
//         'query' : query1,
//         'params' : params1
//       },
//       'id' : cypherBatchId++}]},
//     function(err, res) {
//       callback(err, res.body);
//     }
//   );
// };


// function readBulk(error, responseBody) {
//   var dataFromNeo4j = [];
//   var dataToSwagger = [];
  
//   dataFromNeo4j = responseBody.results[0].data;
//   dataFromNeo4j.map(function (element, index) {
//     dataToSwagger[index] = element.row[0];
//   });

//   return dataToSwagger;
// }

// function idIndex(array, id) {
//   for (var i = 0; i < array.length; i++) {
//     if (array[i].id === id) {
//       return i;
//     }
//   }
//   return null;
// }

// function nodeLinks(error, response) {
//   var nodes = [];
//   var links = [];

//   response.results[0].data.forEach(function (row) {

//     row.graph.nodes.forEach(function (n) {
//       if(idIndex(nodes, n.id) === null) {
//         if(n.labels[0] === 'Movie') {
//           nodes.push({
//             'id': n.id,
//             'label': n.labels[0],
//             'title': n.properties.title,
//             'tagline': n.properties.tagline,
//             'released': n.properties.released
//           });
//         }
//         if(n.labels[0] === 'Person') {
//           nodes.push({
//             'id': n.id,
//             'label': n.labels[0],
//             'name': n.properties.name,
//             'born': n.properties.born
//           });
//         }
//       }
//     });

//     links = links.concat(row.graph.relationships.map(function(r) {
//       return {
//         'source': idIndex(nodes, r.startNode),
//         'target': idIndex(nodes, r.endNode),
//         'value': r.type
//       };
//     }));
//   });

//   return {'nodes':nodes, 'links':links};
// }


// module.exports = {

//   queries: {
//     movies: function() {
//       return queriesBuilder.movies;
//     },
//     persons: function() {
//       return queriesBuilder.persons;
//     },
//     graph: function() {
//       return queriesBuilder.graph;
//     }
//   },
//   params: {
//     inBodyParams: {
//       movies: function(paramsFromSwagger) {
//         return paramsBuilder.inBodyParams.movies.set(paramsFromSwagger);
//       },
//       persons: function(paramsFromSwagger) {
//         return paramsBuilder.inBodyParams.persons.set(paramsFromSwagger);
//       }
//     },
//     otherParams: {
//       movies: function(paramsFromSwagger) {
//         return paramsBuilder.otherParams.movies.set(paramsFromSwagger);
//       },
//       persons: function(paramsFromSwagger) {
//         return paramsBuilder.otherParams.persons.set(paramsFromSwagger);
//       },

//       // {
//       //   create: function (name, born) { 
//       //     params = {  name: name, born: born };   return params; },
//       //   readBulkParam: function (born) {
//       //     params = { born: born };                return params; },
//       //   read: function(id) {
//       //     params = { id: parseInt(id) };          return params; },
//       //   getUpdate: function(id) {
//       //     params = { id: parseInt(id) };          return params; },
//       //   update: function(id, name, born) {
//       //     params = { 
//       //       id: parseInt(id), 
//       //       props: { name: name, born: born } };  return params; },
//       //   getDelete: function(id) {
//       //     params = { id: parseInt(id) };          return params; },
//       //   delete: function(id) {
//       //     params = { id: parseInt(id) };          return params; }
//       // };
//       graph: function() {
//         return {
//           create: function (source, type, target, property) {
//             params = { source: source, type: type, target: target, property: property };   return params; }
//         };
//       }
//     }
//   },
//   callbacks: {
//     movies: { 
//       create: function(res) {
//         return {
//           api: function(error, responseBody) {
//             res.json({
//               movie: responseBody.results[0].data 
//             });
//           },          
//           web: function(error, responseBody) {
//             res.render('movies/read', {
//               slogan: 'New Movie created',
//               movie: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       readBulk: function(res) {
//         return { 
//           api: function(error, responseBody) {
//             var movies = [];
//             movies = readBulk(error, responseBody);

//             res.json({
//               movies:  movies
//             });
//           }, 
//           web: function tet(error, responseBody) {
//             var movies = [];
//             movies = readBulk(error, responseBody);

//             res.render('movies/readBulk', {
//               slogan: 'All The Movies',
//               movies: movies
//             });
//           }
//         };
//       },
//       read: function(res) {
//         return {
//           api: function(error, responseBody) {
//             res.json({
//               movie: responseBody.results[0].data[0].row[0]
//             });
//           },
//           web: function(error, responseBody) {
//             res.render('movies/read', {
//               slogan: 'Movie',
//               movie: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       getUpdate: function(res) {
//         return {
//           web: function(error, responseBody) {
//             res.render('movies/update', { 
//               slogan: 'Update a Movie',
//               id: parseInt(paramsBuilder.movies.get().id),
//               movie: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       update: function(res) {
//         return {
//           api: function(error, responseBody) {
//             res.json({
//               movie: responseBody.results[0].data
//             });
//           },   
//           web: function(error, responseBody) {
//             res.render('movies/read', {
//               slogan: 'Movie updated',
//               movie: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       getDelete: function(res) {
//         return {
//           web: function(error, responseBody){
//             res.render('movies/delete', { 
//               slogan: 'Delete a Movie (and all its relationships)',
//               id: parseInt(paramsBuilder.movies.get().id), 
//               movie: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       delete: function(res) {
//         return { 
//           api: function(error, responseBody) {
//             res.json({
//               nodes_deleted: responseBody.results[0].stats.nodes_deleted
//             });
//           },        
//           web: function(error, responseBody) {
//             res.render('movies/deleted', {
//               slogan: 'Amount of deleted movies',
//               nodes_deleted: responseBody.results[0].stats.nodes_deleted
//             });
//           }
//         };
//       }
//     },
//     persons: {
//       create: function(res) {
//         return {
//           api: function(error, responseBody) {
//             res.json({
//             person: responseBody.results[0].data 
//             });
//           },
//           web: function(error, responseBody) {
//             res.render('persons/read', {
//               slogan: 'New Actor created',
//               person: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       readBulk: function(res) {
//         return {
//           api: function(error, responseBody) {
//             var persons = [];
//             persons = readBulk(error, responseBody);

//             res.json({
//               persons:  persons
//             });
//           },
//           web: function(error, responseBody) {
//             var persons = [];
//             persons = readBulk(error, responseBody);

//             res.render('persons/readBulk', {
//               slogan: 'All The Persons',
//               persons: persons
//             });
//           }
//         };
//       },
//       read: function(res) {
//         return {
//           api: function(error, responseBody) {
//             res.json({
//               person: responseBody.results[0].data[0].row[0]
//             });
//           },
//           web: function(error, responseBody){
//             res.render('persons/read', {
//               slogan: 'Person',
//               person: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       getUpdate: function(res) {
//         return {
//           web: function(error, responseBody){
//             res.render('persons/update', { 
//               slogan: 'Update a Person',
//               id: parseInt(paramsBuilder.persons.get().id),
//               person: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       update: function(res) {
//         return {
//           api: function (error, responseBody) {
//             res.json({
//               person: responseBody.results[0].data
//             });
//           },
//           web: function(error, responseBody) {
//             res.render('persons/read', {
//               slogan: 'Person updated',
//               person: responseBody.results[0].data[0].row[0]
//             });
//           }  
//         };
//       },
//       getDelete: function(res) {
//         return {
//           web: function (error, responseBody) {
//             res.render('persons/delete', { 
//               slogan: 'Delete a Person (and all its relationships)',
//               id: parseInt(paramsBuilder.persons.get().id),
//               person: responseBody.results[0].data[0].row[0]
//             });
//           }
//         };
//       },
//       delete: function(res) {
//         return {
//           api: function(error, responseBody) {
//             res.json({
//               nodes_deleted: responseBody.results[0].stats.nodes_deleted
//             });
//           },
//           web: function (error, responseBody) {
//             console.log(responseBody);
//             res.render('persons/deleted', {
//               slogan: 'Amount of deleted person',
//               nodes_deleted: responseBody.results[0].stats.nodes_deleted
//             });
//           }
//         };
//       }
//     },
//     graph: {
//       readGraph: function (res) {
//         return {
//           api: function (error, response) {
//             var graph = {};
//             graph = nodeLinks(error, response);
            
//             res.json({
//               slogan: 'Visual',
//               graph: graph
//             });
//           }
//         };
//       }
//     }
//   },
//   requests: {
//     movies: function() {
//       return {
//         create: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);   
//         },
//         readBulk: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         read: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         getUpdate: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         update: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         getDelete: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         delete: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         }
//       };
//     },
//     persons: function() {
//       return {
//         create: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);   
//         },
//         readBulk: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         read: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         getUpdate: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         update: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         getDelete: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         delete: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         }
//       };
//     },
//     graph: function() {
//       return {
//         getCreate: function(query0, params0, query1, params1, callback) {
//           cypherBatch(query0, params0, query1, params1, callback);
//         },
//         create: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         },
//         readGraph: function(query, params, resultType, includeStats, callback) {
//           cypherRequest(query, params, resultType, includeStats, callback);
//         }
//       };
//     }
//   },
//   test: function (dbConfig) {
//     return {
//       cypherRequest: function (query, params, resultType, includeStats, callback) {
//         console.log(query);
//         console.log(JSON.stringify(params));
//         console.log(dbConfig.https.url);
//         console.log(config.db.url);
//         request.post({
//           headers: dbConfig.headers,
//           url: dbConfig.https.url,
//           ca: config.db.https.caRead, // process.env.DB_HTTPS_CA
//           json: {statements: [{statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats}]}},
//           function(err, res) {
//             callback(err, res.body);
//           }
//         );
//       },
//       cypherBatch: function (query0, params0, query1, params1, callback) {
//         request.post({
//           headers: headers,
//           url: cypherBatchUrl,
//           ca: dbConfig.db.https.caRead, // process.env.DB_HTTPS_CA
//           json: [ {
//             'method' : cypherBatchJobMethod,
//             'to': cypherBatchJobUrl,
//             'body' : {
//               'query' : query0,
//               'params' : params0
//             },
//             'id' : cypherBatchId++
//           },
//           {
//             'method' : cypherBatchJobMethod,
//             'to': cypherBatchJobUrl,
//             'body' : {
//               'query' : query1,
//               'params' : params1
//             },
//             'id' : cypherBatchId++}]},
//           function(err, res) {
//             callback(err, res.body);
//           }
//         );
//       },
//       callbacks: {
//         movies: {
//           readBulk: function(res) {
//             console.log(res.body);
//             return { 
//               api: function(error, responseBody) {
//                 var movies = [];
//                 movies = readBulk(error, responseBody);

//                 res.json({
//                   movies:  movies
//                 });
//               }, 
//               web: function(error, responseBody) {
//                 var movies = [];
//                 movies = readBulk(error, responseBody);

                

//                 res.render('movies/readBulk', {
//                   slogan: 'All The Movies',
//                   movies: movies
//                 });
//               }
//             };
//           },
//         }
//       }
//     };
//   }
// };