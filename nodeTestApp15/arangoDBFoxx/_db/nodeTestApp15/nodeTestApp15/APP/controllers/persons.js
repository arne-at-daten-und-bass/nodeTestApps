'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Persons = require('../repositories/persons');
var Person = require('../models/person');
var controller = new Foxx.Controller(applicationContext);

var personIdSchema = joi.string().required()
.description('The id of the person')
.meta({allowMultiple: false});

var persons = new Persons(
  applicationContext.collection('persons'),
  {model: Person}
);

/** Lists of all persons.
 *
 * This function simply returns the list of all Person.
 */
controller.get('/', function (req, res) {
  res.json(_.map(persons.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new person.
 *
 * Creates a new person. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var person = req.parameters.person;
  res.json(persons.save(person).forClient());
})
.bodyParam('person', {
  description: 'The person you want to create',
  type: Person
});

/** Reads a person.
 *
 * Reads a person.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(persons.byId(id).forClient());
})
.pathParam('id', personIdSchema)
.errorResponse(ArangoError, 404, 'The person could not be found');

/** Replaces a person.
 *
 * Changes a person. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var person = req.parameters.person;
  res.json(persons.replaceById(id, person));
})
.pathParam('id', personIdSchema)
.bodyParam('person', {
  description: 'The person you want your old one to be replaced with',
  type: Person
})
.errorResponse(ArangoError, 404, 'The person could not be found');

/** Updates a person.
 *
 * Changes a person. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(persons.updateById(id, patchData));
})
.pathParam('id', personIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your person to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The person could not be found');

/** Removes a person.
 *
 * Removes a person.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  persons.removeById(id);
  res.json({success: true});
})
.pathParam('id', personIdSchema)
.errorResponse(ArangoError, 404, 'The person could not be found');
