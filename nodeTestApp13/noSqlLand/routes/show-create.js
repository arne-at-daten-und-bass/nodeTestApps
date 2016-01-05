/**
 * GET for displaying create new entity page, only for logged in users
 * @type   {function}
 * @param  {string} view View to render
 * @param  {object} req  Request
 * @param  {object} res  Response
 */
function showCreate(view, req, res) {
  if (req.session && req.session.user) {
    res.render(view);
  } else {
    res.redirect('/users/login');
  }
}

/**
 * Exports
 * @type {function}
 */
module.exports = showCreate;