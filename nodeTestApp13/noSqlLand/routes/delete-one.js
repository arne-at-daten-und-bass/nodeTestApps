/**
 * GET for actually deleting an entity, only for logged in users who authored the entity (if author prpperty exists)
 * @type   {function}
 * @param  {function} Model   Mongoose model with the entity to delete
 * @param  {[type]}   baseUrl First part of redirection url
 * @param  {object}   req     Request
 * @param  {object}   res     Response
 * @param  {function} next    Next function in loop
 * @return {[type]}           Explicit return only in case of error or forbidden, else rendering a view show-all.jade after successful deletion 
 * */
function deleteOne(Model, baseUrl, req, res, next) {
  if (req.session && req.session.user) {
    Model.findOne({
      _id: req.params.id
    }, function(err, modelEntity) {
      if (err) {
        return next(err);
      }
      if (typeof(Model.schema.path('author')) !== 'undefined') {
        if (modelEntity.author != req.session.user) {
          return res.sendStatus(403);
        }
      }

      modelEntity.remove(function(err) {
        if (err) {
          return next(err);
        }

        res.redirect(baseUrl + '/show-all');
      });
    });
  } else {
    res.redirect('/users/login');
  }
}

/**
 * Exports
 * @type {function}
 */
module.exports = deleteOne;