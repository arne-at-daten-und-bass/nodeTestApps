'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// JSON only API:
module.exports = {

  create: function(req, res) {
    var query = neo.persons.createQuery;
    var params = req.swagger.params.person.value.person;

    function callback(error, responseBody) {
      res.json({
        person: responseBody.results[0].data 
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);  
  },

  readBulk: function(req, res) {
    var query = neo.persons.readBulkQueryParam;
    var params = {
      'born': parseInt(req.swagger.params.born.value)
    };
    if(req.swagger.params.born.value === undefined) {
      query = neo.persons.readBulkQueryNoParam;
    }  

    function callback(error, responseBody) {
      var persons = [];
      persons = neo.helpers.readBulk(error, responseBody);

      res.json({
        persons:  persons
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  }, 

  read: function(req, res) {
    var query = neo.persons.readQuery;
    var params = {
      'id': parseInt(req.swagger.params.personId.value)
    }; 

    function callback(error, responseBody){
      res.json({
        person: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.persons.updateQuery;
    var params = {
      'id': parseInt(req.swagger.params.personId.value),
      'props': req.swagger.params.person.value.person
      }; 

    function callback(error, responseBody) {
      res.json({
        person: responseBody.results[0].data
      });
    }   

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  delete: function(req, res) {
    var query = neo.persons.deleteQuery;
    var params = {
      'id': parseInt(req.swagger.params.personId.value)
    };
    
    includeStats = true;

    function callback(error, responseBody) {
      res.json({
        nodes_deleted: responseBody.results[0].stats.nodes_deleted
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};