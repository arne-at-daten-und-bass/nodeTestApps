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

  // readOne: function(req, res) {
  //   var released = req.swagger.params.released.value;
  //   var query = 'MATCH (m:Movie {released: "' + released + '"}) RETURN m';
  //   console.log(query);
  //   var dataFromNeo4j = [];
  //   var dataToSwagger = [];

  //     request.post({
  //       headers: {
  //         'Authorization': 'Basic bmVvNGo6cGFzc3dvcmQ=',
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json; charset=UTF-8'
  //       },
  //       uri: dbRESTUrl,
  //       json: {statements: [{statement: query}]}
  //     }, function (error, response) {
  //         dataFromNeo4j = response.body.results[0].data;
  //         dataFromNeo4j.map(function(element, index) {
  //           dataToSwagger[index] = element.row;
  //         });
  //         res.json({
  //           movies: dataToSwagger
  //         });
  //     });
  //   },    

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
  },

  show: function(req, res) {
    var id = req.swagger.params.movieId.value;
    var query = 'MATCH m WHERE id(m)=' + id + ' RETURN m';
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
        console.log(response.body.results[0].data[0].row[0]);
        res.json({
          movie: response.body.results[0].data[0].row[0]
        });
    });
  },

  update: function(req, res) {
    var params = {
      'id': parseInt(req.swagger.params.movieId.value),
      'props': req.swagger.params.movie.value.movie
      }; 
    console.log(params);
    var query = 'MATCH m WHERE id(m)={id} SET m={props} RETURN m';
    console.log(query);
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
          movie: params.props
        });
    });   
  },

  delete: function(req, res) {
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 
    console.log(params);
    var query = 'MATCH m WHERE id(m)={id} DELETE m';
    console.log(query);
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
          movie: { "title": "dummy", "released": 2000, "tagline": "dummy"}
        });
    });   
  }

};


