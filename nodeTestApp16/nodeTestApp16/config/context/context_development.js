'use strict';

var webConfig = require('../app').web();
var dbConfig = require('../app').db();

var localesStringsMovies = require('../locales/locales_strings_movies');
var localesCommandsApp = require('../locales/locales_commands_app');
var localesUtils = require('../locales/utils/locales_utils');

var queries = require('../../models/neo4j/rest_api/queries');
var params = require('../../models/neo4j/rest_api/params');
var callbacks = require('../../models/neo4j/rest_api/callbacks');
var requests = require('../../models/neo4j/rest_api/requests');

var context = {
  global: {
    crudTypes: [],
    locales: [],
  },
  nodes:{
    movies: {
      nodeType: 'movie',
      nodeTypePlural: 'movies',
      name: 'Movie',
      namePlural: 'Movies',
      templateFolder: 'movies',
      properties: ['title', 'tagline', 'released'],
      inQueryParams: ['released'],
      queries: queries.movies(),
      params: params,
      callbacks: callbacks,
      requests: requests.db(dbConfig),
      renderArguments: {
        getCreate: ['Create a new Movie', ''] ,
        create: ['New Movie created', ''],
        read: ['Movie', ''],
        readBulk: ['All The Movies', ''],
        getUpdate: ['Update a Movie', ''],
        update: ['Movie updated', ''],
        getDelete: ['Delete a Movie (and all its relationships)', ''],
        delete: ['Deleted movie'],
      }
    },
    persons: {
      nodeType: 'person',
      name: 'Person',
      namePlural: 'Persons',
      templateFolder: 'persons',
      properties: ['name', 'born'],
      inQueryParams: ['born'],
      queries: queries.persons(),
      params: params,
      callbacks: callbacks,
      requests: requests.db(dbConfig),
      renderArguments: {
        getCreate: ['persons/create', 'Create a new Person'] ,
        create: [],
        read: [],
        readBulk: ['readBulk', 'persons', 'persons/readBulk', 'All The Persons'],
        getUpdate: [],
        update: [],
        getDelete: [],
        delete: [],
      }
    }
  },
  graph: {
    relationshipTypes: [],

  }
};

var context_development = require('../../api/controllers/html_web_nodes')
                            .call(context.nodes.movies, localesUtils(localesStringsMovies, localesCommandsApp));

module.exports = context_development;
