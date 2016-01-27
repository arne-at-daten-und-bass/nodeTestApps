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

  createQuery: 'CREATE (m:Movie { title: {title}, released: {released}, tagline: {tagline} }) RETURN m',
  readBulkQueryParam: 'MATCH (m:Movie {released: {released}}) RETURN m',
  readBulkQueryNoParam: 'MATCH (m:Movie) RETURN m',
  readQuery: 'MATCH m WHERE id(m)={id} RETURN m',
  getUpdateQuery:'MATCH m WHERE id(m)={id} RETURN m',
  updateQuery:'MATCH m WHERE id(m)={id} SET m={props} RETURN m',
  getDeleteQuery: 'MATCH m WHERE id(m)={id} RETURN m',
  deleteQuery: 'MATCH m WHERE id(m)={id} DELETE m'

};