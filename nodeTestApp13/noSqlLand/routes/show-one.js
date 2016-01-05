/**
 * Requirements
 * @type {[type]}
 */
var mongoose = require('mongoose');

/**
 * GET for displaing one existing mongoose model entity
 * @type   {function}
 * @param  {string}   view    View to render
 * @param  {function} Model   Mongoose model to find and show the requested entity
 * @param  {object}   req     Request
 * @param  {object}   res     Response
 * @param  {function} next    Next function in loop
 * @return {function} next    Explicit return only in case of error or missing entity, else rendering view with modelEntity 
 */
function showOne(view, Model, req, res) {
  var query = Model.findById(req.params.id);

  //promise depends on require('express-mongoose'); in app.js 
  //adds mongoose query and promise support to express
  var promise = findComments(req.params.id)
    .sort('created')
    .select('-_id') // exclude the _id
    .exec();

  if (typeof(Model.schema.path('author')) !== 'undefined') {
    query.populate('author');
  }

  query.exec(function(err, modelEntity) {
    if (err) {
      return next(err);
    }
    if (!modelEntity) {
      return next;
    }

    res.render(view, {
      modelEntity: modelEntity,
      comments: promise
    });
  });
}

function findComments(id, callback) {
  return mongoose.model('Comments').find({
    referencedEntity: id
  }, callback);
}

/**
 * Exports
 * @type {function}
 */
module.exports = showOne;