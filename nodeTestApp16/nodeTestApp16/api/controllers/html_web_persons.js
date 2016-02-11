'use strict';

var neo = require('../helpers/neo');

var includeStats = false;
var resultType = ["row"];

// HTML Web:
module.exports = {

  getCreate: function(req, res) {
    res.render('persons/create', 
      { slogan: 'Create a new Actor' 
    });  
  },

  create: function(req, res) {
    var query = neo.persons.createQuery;
    var params = {
      'born': parseInt(req.swagger.params.born.value),
      'name': req.swagger.params.name.value
    };

    function callback(error, responseBody) {
      res.render('persons/read', {
        slogan: 'New Actor created',
        person: responseBody.results[0].data[0].row[0]
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

      res.render('persons/readBulk', {
        slogan: 'All The Persons',
        persons: persons
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
      res.render('persons/read', {
        slogan: 'Person',
        person: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getUpdate: function(req, res) {
    var query = neo.persons.getUpdateQuery;
    var params = {
      'id': parseInt(req.swagger.params.personId.value)
    }; 

    function callback(error, responseBody){
      res.render('persons/update', { 
        slogan: 'Update a Person',
        id: parseInt(req.swagger.params.personId.value),
        person: responseBody.results[0].data[0].row[0]
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  update: function(req, res) {
    var query = neo.persons.updateQuery;
    var params = {
      'id': parseInt(req.swagger.params.personId.value),
      'props': {
        'name': req.swagger.params.name.value,
        'born': parseInt(req.swagger.params.born.value)
        }
      };

    function callback(error, responseBody) {
      res.render('persons/read', {
        slogan: 'Person updated',
        person: responseBody.results[0].data[0].row[0]
      });
    }   

    neo.cypherRequest(query, params, resultType, includeStats, callback);
  },

  getDelete: function(req, res) {
    var query = neo.persons.getDeleteQuery;
    var params = {
      'id': parseInt(req.swagger.params.personId.value)
    }; 

    function callback(error, responseBody){
      res.render('persons/delete', { 
        slogan: 'Delete a Person (and all its relationships)',
        id: parseInt(req.swagger.params.personId.value),
        person: responseBody.results[0].data[0].row[0]
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
      res.render('persons/deleted', {
        slogan: 'Amount of deleted person',
        nodes_deleted: responseBody.results[0].stats.nodes_deleted
      });
    }

    neo.cypherRequest(query, params, resultType, includeStats, callback);   
  }

};