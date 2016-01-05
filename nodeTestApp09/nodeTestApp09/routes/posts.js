var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
var BlogPost = mongoose.model('BlogPost');
var Comment = mongoose.model('Comment');

module.exports = function(app) {

	//show "create new posts" page
	app.get('/post/create', loggedIn, function(req, res) {
		res.render('post/create.jade');
	});

	//actually create new posts
	app.post('/post/create', loggedIn, function(req, res, next) {
		var title = req.param('title');
		var body = req.param('body');
		var user = req.session.user;

		BlogPost.create({
			body: body,
			title: title,
			author: user
		}, function(err, post) {
			if (err) {
				return next(err);
			}
			res.redirect('/post/' + post.id);
		});

		// Notify function for new posts in model
	});

	// show post as read
	app.get('/post/:id', function(req, res, next) {
		var id = req.param('id');

		var promise = BlogPost.findComments(id).sort('created')
			.select('-_id') //exclude the id
			.exec();

		var query = BlogPost.findById(req.param('id')); // query builder object becaus of missing callback

		query.populate('author'); // lookups author users collection

		query.exec(function(err, post) {
			if (err) {
				return next(err);
			}
			if (!post) {
				return next;
			} // 404
			res.render('post/view.jade', {
				post: post,
				comments: promise
			});
		});
	});

	//edit post
	app.get('/post/edit/:id', function(req, res, next) {
		res.render('post/create.jade', {post: BlogPost.findById(req.param('id'))});
	});

	app.post('/post/edit/:id', loggedIn, function(req, res, next) {
		BlogPost.edit(req, function(err) {
			if(err) {
				return next(err);
			}
			res.redirect('/post/' + req.param('id'));
		});
	});

	//Comments
	app.post('/post/comment/:id', loggedIn, function(req,res, next) {
		var id = req.param('id');
		var text = req.param('text');
		var author = req.session.user;

		Comment.create({
			post: id,
			text: text,
			author: author
		}, function(err, comment) {
			if(err) { return next(err) }

			res.redirect('/post/' + id);
		})
	})

	//delete
	app.get('/post/remove/:id', function(req, res, next) {
		var id = req.param('id');

		BlogPost.findOne({_id: id}, function(err, post) {
			if (err) {
				return next(err);
			}
			if (post.author != req.session.user) {
				return res.send(403);
			} 

			post.remove(function(err) {
				if (err) {
					return next(err);
				}
				//TODO Display confirmation msg. to user
				res.redirect('/');

				//TODO remove old comments wtih mongoose lifecycle events
			});
		});
	});
};