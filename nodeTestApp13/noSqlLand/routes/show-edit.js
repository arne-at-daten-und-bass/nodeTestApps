/**
 * GET for displaying the page for editing an entity, only for logged in users
 * @type   {function}
 * @param  {function} Model Mongoose model with the entity to update
 * @param  {string}   view  View to render
 * @param  {object}   req   Request
 * @param  {object}   res   Response
 * @param  {function} next  Next function in loop
 * @return {function} next  Explicit return only in case of error or missing model entity, else rendering a view with the entity to edit
 */
function showEdit(Model, view, req, res, next) {
  if (req.session && req.session.user) {
    var query = Model.findById(req.params.id);

    query.exec(function(err, modelEntity) {
      if (err) {
        return next(err);
      }
      if (!modelEntity) {
        return next;
      }

      res.render(view, {
        modelEntity: modelEntity
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
module.exports = showEdit;