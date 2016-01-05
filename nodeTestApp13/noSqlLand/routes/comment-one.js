var mongoose = require('mongoose');
var Comment = mongoose.model('Comments');

function commentOne(Model, baseUrl, req, res, next) {
  Comment.create({
    type: Model.modelName,
    text: req.param('text'),
    referencedEntity: req.params.id,
    author: req.session.user
  }, function(err, comment) {
    if (err) {
      return next(err);
    }

    res.redirect(baseUrl + "/id/" + req.params.id);
  });
}

module.exports = commentOne;