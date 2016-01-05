/**
 * POST for actually creating a new entity, only for logged in users
 * @type   {function}
 * @param  {object}   update  Object containing the properties to update
 * @param  {function} Model   Mongoose model with the entity to update
 * @param  {[type]}   baseUrl First part of redirection url (showing updated entity after successful update)
 * @param  {object}   req     Request
 * @param  {object}   res     Response
 * @param  {function} next    Next function in loop
 * @return {function} next    Explicit return only in case of error, else rendering a view with the updated entity */
function editOne(update, Model, baseUrl, req, res, next) {
  if (req.session && req.session.user) {
    Model.findByIdAndUpdate(req.params.id, update, function(err, updatedObject) {
      if (err) {
        return next(err);
      }

      res.redirect(baseUrl + '/id/' + updatedObject.id);
    });
  } else {
    res.redirect('/users/login');
  }
}

/**
 * Exports
 * @type {function}
 */
module.exports = editOne;