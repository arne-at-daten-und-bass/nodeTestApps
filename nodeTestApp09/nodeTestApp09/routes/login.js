var mongoose = require('mongoose');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function(app) {

	app.get('/login', function(req, res) {
		res.render('login.jade');
	});

	// user login
	app.post('/login', function(req, res, next) {
		var email = cleanString(req.param('email'));
		var pass = cleanString(req.param('pass'));
		if (!(email && pass)) {
			return invalid();
		}

		email = email.toLowerCase();

		User.findById(email, function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return invalid();
			}
			if (user.hash != hash(pass, user.salt)) {
				return invalid();
			}

			//valid user entered and found	
			req.session.isLoggedIn = true;
			req.session.user = email;
			res.redirect('/');
		});

		function invalid() {
			return res.render('login.jade', {
				invalid: true
			});
		}
	});

	app.get('/logout', function(req, res) {
		req.session.isLoggedIn = false;
		req.session.user = null;
		res.redirect('/');
	});

};