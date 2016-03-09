'use strict';

var webConfig = require('../app').web();
var dbConfig = require('../app').db();

var queries = require('../../models/neo4j/rest_api/queries');
var params = require('../../models/neo4j/rest_api/params');
var callbacks = require('../../models/neo4j/rest_api/callbacks');
var requests = require('../../models/neo4j/rest_api/requests');

var localesMenuApp = require('../locales/locales_menu_app');
var localesCommandsApp = require('../locales/locales_commands_app');
var localesStringsMovies = require('../locales/locales_strings_movies');
var localesStringsPersons = require('../locales/locales_strings_persons');
var localesUtils = require('../locales/utils/locales_utils');

var context = {
  index: {
    crudTypes: [],      // @TODO: Not used yet, better taken from Swagger ? Does each nodetype require own CRUDs? Global?
    supportedLocales: ['en', 'es', 'de', 'fr'], //@TODO: Already meaningful used???
    defaultLocale: 'en',
  },
  nodes:{
    movies: {
      nodeType: 'movie',
      nodeTypePlural: 'movies',
      name: 'Movie',
      namePlural: 'Movies',
      templateFolder: 'movies',
      properties: ['title', 'tagline', 'released'], // Not used yet, better taken from Swagger ?
      inQueryParams: ['released'],                  // Not used yet, better taken from Swagger ?
      queries: queries.movies(),
      params: params,
      callbacks: callbacks,
      requests: requests.db(dbConfig),
    },
    persons: {
      nodeType: 'person',
      nodeTypePlural: 'persons',
      name: 'Person',
      namePlural: 'Persons',
      templateFolder: 'persons',
      properties: ['name', 'born'],     // Not used yet, better taken from Swagger ?
      inQueryParams: ['born'],          // Not used yet, better taken from Swagger ?
      queries: queries.persons(),
      params: params,
      callbacks: callbacks,
      requests: requests.db(dbConfig),
    }
  },
  graph: {
    relationshipTypes: ['ACTED_IN', 'DIRECTED', 'FOLLOWS', 'PRODUCED', 'REVIEWED', 'WROTE'],
    queries: queries.graph(),
    params: params,
    callbacks: callbacks,
    requests: requests.db(dbConfig),
  },
};


var context_html_web_index = require('../../api/controllers/html_web_index')
                               .call(context.index); 

var context_json_api_graph = require('../../api/controllers/json_api_graph')
                               .call(context.graph); 

var context_json_api_movies = require('../../api/controllers/json_api_nodes')
                               .call(context.nodes.movies); 

var context_json_api_persons = require('../../api/controllers/json_api_nodes')
                               .call(context.nodes.persons); 

var context_html_web_movies = require('../../api/controllers/html_web_nodes')
                               .call(context.nodes.movies, localesUtils(context.index.defaultLocale, localesMenuApp, localesCommandsApp, localesStringsMovies));

var context_html_web_persons = require('../../api/controllers/html_web_nodes')
                               .call(context.nodes.persons, localesUtils(context.index.defaultLocale, localesMenuApp, localesCommandsApp, localesStringsPersons));

module.exports = {
  context_html_web_index: context_html_web_index,
  context_json_api_graph: context_json_api_graph,
  context_json_api_movies: context_json_api_movies,
  context_json_api_persons: context_json_api_persons,
  context_html_web_movies: context_html_web_movies,
  context_html_web_persons: context_html_web_persons,
};
