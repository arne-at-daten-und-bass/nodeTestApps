'use strict';

var request = require('request');
var config = require('../../config/');

module.exports = {

  cypherRequest: function (query, params, resultType, includeStats, callback) {
    request.post({
      headers: {
        'Authorization': process.env.DB_PASS,
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=UTF-8'},
      url: config.db.url,
      ca: config.db.https.caRead,
      json: {statements: [{statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats}]}},
      function(err, res) {
        callback(err, res.body);
      }
    );
  },

  movies: {
    createQuery: 'CREATE (m:Movie { title: {title}, released: {released}, tagline: {tagline} }) RETURN m',
    readBulkQueryParam: 'MATCH (m:Movie {released: {released}}) RETURN m',
    readBulkQueryNoParam: 'MATCH (m:Movie) RETURN m',
    readQuery: 'MATCH m WHERE id(m)={id} RETURN m',
    getUpdateQuery:'MATCH m WHERE id(m)={id} RETURN m',
    updateQuery:'MATCH m WHERE id(m)={id} SET m={props} RETURN m',
    getDeleteQuery: 'MATCH m WHERE id(m)={id} RETURN m',
    deleteQuery: 'MATCH m WHERE id(m)={id} DELETE m'
  },

  persons: {
    createQuery: 'CREATE (p:Person { born: {born}, name: {name} }) RETURN p',
    readBulkQueryParam: 'MATCH (p:Person {born: {born}}) RETURN p',
    readBulkQueryNoParam: 'MATCH (p:Person) RETURN p',
    readQuery: 'MATCH p WHERE id(p)={id} RETURN p',
    getUpdateQuery:'MATCH p WHERE id(p)={id} RETURN p',
    updateQuery:'MATCH p WHERE id(p)={id} SET p={props} RETURN p',
    getDeleteQuery: 'MATCH p WHERE id(p)={id} RETURN p',
    deleteQuery: 'MATCH p WHERE id(p)={id} DELETE p'
  },

  graph: {
    readAllQuery: 'MATCH path = (n)-[r]->(m) RETURN path'
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