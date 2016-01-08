'use strict';

var request = require('request');

var host = '172.17.0.4';
var port = 7474;


//var dbRESTUrl ='http://neo4j:password@' + host + ':' + port + '/db/data/transaction/commit';
var dbRESTUrl ='http://' + host + ':' + port + '/db/data/transaction/commit';

module.exports = {

  index: function(req, res) {
    var query = 'MATCH (n:Movie) RETURN n LIMIT 10';
    var dataFromNeo4j = [];
    var dataToSwagger = [];

      request.post({
        headers: {
          'Authorization': 'Basic bmVvNGo6cGFzc3dvcmQ=',
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=UTF-8'
        },
        uri: dbRESTUrl,
        json: {statements: [{statement: query}]}
      }, function (error, response) {
          dataFromNeo4j = response.body.results[0].data;
          dataFromNeo4j.map(function(element, index) {
            dataToSwagger[index] = element.row;
          });
          res.json({
            movies: dataToSwagger
          });
      });
    },

  readOne: function(req, res) {
    var title = req.swagger.params.title.value;
    var query = 'MATCH (m:Movie {title: "' + title + '"}) RETURN m';
    console.log(query);
    var dataFromNeo4j = [];
    var dataToSwagger = [];

      request.post({
        headers: {
          'Authorization': 'Basic bmVvNGo6cGFzc3dvcmQ=',
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=UTF-8'
        },
        uri: dbRESTUrl,
        json: {statements: [{statement: query}]}
      }, function (error, response) {
          dataFromNeo4j = response.body.results[0].data;
          dataFromNeo4j.map(function(element, index) {
            dataToSwagger[index] = element.row;
          });
          res.json({
            movies: dataToSwagger
          });
      });
    },    

  create: function(req, res) {
    var query = 'CREATE (m:Movie { title: {title}, released: {released}, tagline: {tagline} }) RETURN m'; 
    var params = req.swagger.params.movie.value.movie;
      request.post({
        headers: {
          'Authorization': 'Basic bmVvNGo6cGFzc3dvcmQ=',
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=UTF-8'
        },
        uri: dbRESTUrl,
        json: {statements: [{statement: query, parameters: params}]}
      }, function (error, response) {
          res.json({
            movie: params
          });
      });   
    }

};
