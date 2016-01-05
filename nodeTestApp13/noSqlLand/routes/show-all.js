/**
 * GET for listing all mongoose models' entities (Users, Posts, Databases, Persons)
 * @type   {function}
 * @param  {string}   view    View to render
 * @param  {function} Model   Mongoose model to find and show its found entities
 * @param  {object}   req     Request
 * @param  {object}   res     Response
 * @param  {function} next    Next function in loop
 * @return {function} next    Explicit return only in case of error, else rendering view with modelEntities  
 */
function showAll(view, Model, req, res, next) {
  Model.find().sort({
    'created': -1
  }).limit(10).exec(function(err, modelEntities) {
    if (err) {
      return next(err);
    }

    res.render(view, {
      title: 'NoSqlLand',
      modelEntities: modelEntities
    });
  });
}

/**
 * Exports
 * @type {function}
 */
module.exports = showAll;