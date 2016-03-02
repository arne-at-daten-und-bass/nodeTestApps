// 'use strict';

// var webConfig = require('../app_config').web();
// var dbConfig = require('../app_config').db();

// var queries = require('../../models/queries');
// var params = require('../../models/params');
// var callbacks = require('../../models/callbacks');
// var requests = require('../../models/requests');

// var context = {
//   nodes:{
//     movies: {
//       name: 'Movie'
//       namePlural: 'Movies'
//       templateFolder: 'movies'
//       properties: ['title', 'tagline', 'released'],
//       inQueryParams: ['released'],
//       queries: queries.movies(),
//       params: params.movies,
//       callbacks: callbacks,
//       requests: requests.db(dbConfig),
//       renderArguments: {
//         getCreate: ['movies/create', 'Create a new Movie'] ,
//         create: [],
//         read: [],
//         readBulk: ['readBulk', 'movies', 'movies/readBulk', 'All The Movies'],
//         getUpdate: [],
//         update: [],
//         getDelete: [],
//         delete: [],
//       }
//     },
//     persons: {
//       properties: ['name', 'born'],
//       inQueryParams: ['born'],
//       queries: queries.persons(),
//       params: params.persons,
//       callbacks: callbacks,
//       requests: requests.db(dbConfig),
//       renderArguments: {
//         getCreate: ['persons/create', 'Create a new Person'] ,
//         create: [],
//         read: [],
//         readBulk: ['readBulk', 'persons', 'persons/readBulk', 'All The Persons'],
//         getUpdate: [],
//         update: [],
//         getDelete: [],
//         delete: [],
//       }
//     }
//   },
//   graph: {
//     relationshipTypes: [],

//   }
// };

// // var context_development = require('../../api/controllers/html_web_movies').call({}, context.html_web.movies);
// var context_development_p = require('../../api/controllers/html_web_movies').call(context.html_web.persons,  'persons');

// module.exports = context_development_p;

// // var neoTwo = require('../helpers/neo').test.call({}, dbConfig);

// // var databaseFactory = require('./services/database'),
// //     todoServiceFactory = require('./services/todo_service');

// // var serverFactory = require('./modules/server'),
// //     todoApiFactory = require('./modules/todo_api');

// // container.register('dbConfig', [], dbConfig);
// // container.register('serverConfig', [], serverConfig);

// // container.register('database', ['dbConfig'], databaseFactory);
// // container.register('todoService', ['database'], todoServiceFactory);

// // container.register('server', ['serverConfig'], serverFactory);
// // container.register('todoApi', ['server', 'todoService'], todoApiFactory);

