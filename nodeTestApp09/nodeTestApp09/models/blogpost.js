var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: { type: String, trim: true},
	created: { type: Date, default: Date.now },
	body: String,
	author: { type: String, ref: 'User'}
});

//module lifecycle for twitters

schema.statics.findComments = function(id, callback) {
	return this.model('Comment').find({ post: id }, callback);
}

schema.statics.edit = function(req, callback) {
	var id = req.param('id');
	var author = req.session.user;

	var query = { _id: id, author: author };

	var update = {};
	update.title = req.param('title');
	update.body = req.param('body');

	this.update(query, update, function(err, numAffected) {
		if(err) { 
			return callback(err);
		}

		if (0 === numAffected) {
			return callback(new Error('no posts affedted'));
		}

		callback();
	});
}; 

module.exports = mongoose.model('BlogPost', schema);