var express = require('express');
var router = express.Router();
var service = require('../services/DataServices.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log('Getting user list from data service.');
	service.getAllUsers().then(
		function(list) {
			console.log(list);
			res.render('userlist', {
				'userlist': list
			});
		},
		function(err) {
			console.error('Error: ', err);
			res.send('Problem getting the information from the database: ' + err);
		});
});

/* GET new user page */
router.get('/newuser', function(req, res) {
	res.render('newuser', {
		title: 'Add New User'
	});
});

/* POST new user */
router.post('/adduser', function(req, res) {
	console.log('Adding user.');
	var user = {
		'username': req.body.username,
		'email': req.body.useremail
	};
	service.addUser(user).then(
		function(result) {
			console.log(result);
			res.redirect('/users');
		},
		function(err) {
			console.error('Error: ', err);
			res.send('Problem adding the information to the database: ' + err);
		}
	);
});

/* GET User by key */
router.get('/:key', function(req, res) {
	console.log('Getting user by key.');
	var userkey = req.params.key;
	service.getUserByKey(userkey).then(
		function(list) {
			console.log(list);
			res.render('userinfo', {
				'user': list[0]
			});
		},
		function(err) {
			console.error('Error: ', err);
			res.send('Problem getting the information from the database: ' + err);
		}
	);
});

/* GET ??? to delete user */
router.get('/:key/delete', function(req, res) {
	console.log('Deleting user');
	var userkey = req.params.key;
	service.removeUser(userkey).then(
		function(list) {
			console.log(list);
			res.redirect('/users');
		},
		function(err) {
			console.error('Error: ', err);
			res.send('Problem deleting the information from the database: ' + err);
		}
	);
});

/* GET ??? to update user (AW: different route and render compared to above) */
router.get('/:key/update', function(req, res) {
	console.log('Getting user by key for update.');
	var userkey = req.params.key;
	service.getUserByKey(userkey).then(
		function(list) {
			console.log(list);
			res.render('userupdate', {
				'user': list[0]
			});
		},
		function(err) {
			console.error('Error: ', err);
			res.send('Problem getting the information from the database: ' + err);
		}
	);
});

/* POST to update user*/
router.post('/:key/update', function(req, res) {
	console.log('Updating user');
	var user = {
		'key': req.params.key,
		'username': req.body.username,
		'email': req.body.useremail
	};
	service.updateUser(user).then(
		function(result) {
			console.log(result);
			res.redirect('/users');
		},
		function(err) {
			console.error('Error: ', err);
			res.send('Problem changing the information in the database: ' + err);
		}
	);
});

module.exports = router;