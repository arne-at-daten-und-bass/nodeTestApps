var signup = require('./signup');
var login = require('./login');
var posts = require('./posts');
var errors = require('./errors');
var mongoose = require('mongoose');
var BlogPost = mongoose.model('BlogPost');

module.exports = function(app) {

	//home page
	app.get('/', function(req, res, next) {
		// makes use of a query bulider because of missing callback
		BlogPost.find().sort('created').limit(10).exec(function(err, posts) {
			if (err) {
				return next(err);
			}
			res.render('home.jade', {
				posts: posts
			});
		});
	});

	//signup /signup routes
	signup(app);

	//login / logout routes
	login(app);

	//blog posts crud
	posts(app);

	//error handlers
	errors(app);
};