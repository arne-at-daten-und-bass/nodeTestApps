'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Databases = require('../repositories/databases');
var Database = require('../models/database');
var controller = new Foxx.Controller(applicationContext);

var databaseIdSchema = joi.string().required()
.description('The id of the database')
.meta({allowMultiple: false});

var databases = new Databases(
  applicationContext.collection('databases'),
  {model: Database}
);

/** Lists of all databases.
 *
 * This function simply returns the list of all Database.
 */
controller.get('/', function (req, res) {
  res.json(_.map(databases.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new database.
 *
 * Creates a new database. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var database = req.parameters.database;
  res.json(databases.save(database).forClient());
})
.bodyParam('database', {
  description: 'The database you want to create',
  type: Database
});

/** Reads a database.
 *
 * Reads a database.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(databases.byId(id).forClient());
})
.pathParam('id', databaseIdSchema)
.errorResponse(ArangoError, 404, 'The database could not be found');

/** Replaces a database.
 *
 * Changes a database. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var database = req.parameters.database;
  res.json(databases.replaceById(id, database));
})
.pathParam('id', databaseIdSchema)
.bodyParam('database', {
  description: 'The database you want your old one to be replaced with',
  type: Database
})
.errorResponse(ArangoError, 404, 'The database could not be found');

/** Updates a database.
 *
 * Changes a database. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(databases.updateById(id, patchData));
})
.pathParam('id', databaseIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your database to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The database could not be found');

/** Removes a database.
 *
 * Removes a database.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  databases.removeById(id);
  res.json({success: true});
})
.pathParam('id', databaseIdSchema)
.errorResponse(ArangoError, 404, 'The database could not be found');
