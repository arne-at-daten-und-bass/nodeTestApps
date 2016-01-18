'use strict';

var request = require('request');

var host = '172.17.0.8';
var port = 7474;
var dbRESTUrl ='http://' + host + ':' + port + '/db/data/transaction/commit';

var includeStats = false;

function cypherRequest(query, params, includeStats, callback) {
  request.post({
    headers: {
      'Authorization': 'Basic bmVvNGo6cGFzc3dvcmQ=',
      'Content-Type': 'application/json',
      'Accept': 'application/json; charset=UTF-8'},
    uri: dbRESTUrl,
    json: {statements: [{statement: query, parameters: params, includeStats: includeStats}]}},
    function(err, res) {
      callback(err, res.body);
    }
  );
}

module.exports = {

  create: function(req, res) {
    var query = 'CREATE (m:Movie { title: {title}, released: {released}, tagline: {tagline} }) RETURN m'; 
    // JSON only API:
    // var params = req.swagger.params.movie.value.movie;
    // HTML API:
    var params = {
      'title': req.swagger.params.title.value,
      'released': parseInt(req.swagger.params.released.value),
      'tagline': req.swagger.params.tagline.value
    };

    function callback(error, responseBody) {
      // JSON only API:
      // res.json({
      //   movie: responseBody.results[0].data 
      // });
      // HTML API:
      res.render('read', {
        movie: responseBody.results[0].data[0].row[0]
      });
    }

    cypherRequest(query, params, includeStats, callback);   
  }, 

  read: function(req, res) {
    var query = 'MATCH m WHERE id(m)={id} RETURN m';
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 

    function callback(error, responseBody){
      // JSON only API:
      // res.json({
      //   movie: responseBody.results[0].data[0].row[0]
      // });
      // HTML API:
      res.render('create', {
        movie: responseBody.results[0].data[0].row[0],
        id: parseInt(req.swagger.params.movieId.value)
      });
    }

    cypherRequest(query, params, includeStats, callback);
  },

  readBulk: function(req, res) {
    var query = 'MATCH (m:Movie {released: {released}}) RETURN m';
    var params = {
      'released': parseInt(req.swagger.params.released.value)
    };
    if(req.swagger.params.released.value === undefined) {
      query = 'MATCH (m:Movie) RETURN m';
    }  

    function callback(error, responseBody) {
      var dataFromNeo4j = [];
      var dataToSwagger = [];
      dataFromNeo4j = responseBody.results[0].data;
      dataFromNeo4j.map(function(element, index) {
        dataToSwagger[index] = element.row;
      });
      // JSON only API:
      // res.json({
      //   movies: dataToSwagger
      // });
      // HTML API:
      res.render('readBulk', {
        movies: dataToSwagger
      });
    }

    cypherRequest(query, params, includeStats, callback);
  }, 

  update: function(req, res) {
    var query = 'MATCH m WHERE id(m)={id} SET m={props} RETURN m';
    // JSON only API:
    // var params = {
    //   'id': parseInt(req.swagger.params.movieId.value),
    //   'props': req.swagger.params.movie.value.movie
    //   }; 
    // HTML API:
    var params = {
      'id': parseInt(req.swagger.params.movieId.value),
      'props': {
        'title': req.swagger.params.title.value,
        'released': parseInt(req.swagger.params.released.value),
        'tagline': req.swagger.params.tagline.value
        }
      };

    function callback(error, responseBody) {
      // JSON only API:
      // res.json({
      //   movie: responseBody.results[0].data
      // });
      // HTML API:
      res.render('read', {
        movie: responseBody.results[0].data[0].row[0]
      });
    }   

    cypherRequest(query, params, includeStats, callback);
  },

  delete: function(req, res) {
    var query = 'MATCH m WHERE id(m)={id} DELETE m';
    var params = {
      'id': parseInt(req.swagger.params.movieId.value)
    }; 
    includeStats = true;

    function callback(error, responseBody) {
      // JSON only API:
      // res.json({
      //   nodes_deleted: responseBody.results[0].stats.nodes_deleted
      // });
      res.render('read', {
        nodes_deleted: responseBody.results[0].stats.nodes_deleted
      });
    }

    cypherRequest(query, params, includeStats, callback);   
  }

};


