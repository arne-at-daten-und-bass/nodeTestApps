'use strict';

var request = require('request');
var config = require('../../config/');

module.exports = {

  cypherRequest: function (query, params, includeStats, callback) {
    request.post({
      headers: {
        'Authorization': process.env.DB_PASS,
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=UTF-8'},
      url: config.db.url,
      ca: config.db.https.caRead,
      json: {statements: [{statement: query, parameters: params, includeStats: includeStats}]}},
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
  }

};