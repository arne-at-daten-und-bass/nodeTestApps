var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET hello world page. */
router.get('/helloworld', function(req, res){
		res.render('helloworld', { title: 'Hello, World!'})
});


/* GET user list page. */
router.get('/userlist', function(req, res){
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({}, {}, function(e, docs){
		res.render('userlist', {
			"userlist" : docs
		});
	});
});


/* GET topic list page. */
router.get('/topicslist', function(req, res){
	var db = req.db;
	var collection = db.get('topicscollection');
	collection.find({}, {}, function(e, docs){
		res.render('topicslist', {
			"topicslist" : docs
		});
	});
});


/* GET new user page. */
router.get('/newuser', function(req, res){
	res.render('newuser', {title: 'Add new user'});
});


/* GET new topic page. */
router.get('/newtopic', function(req, res){
	res.render('newtopic', {title: 'Add new topic'});
});


/* POST for add new user service. */
router.post('/adduser', function(req, res){
	var db = req.db;
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	var collection = db.get('usercollection');

	collection.insert({
		"username" : userName,
		"useremail" : userEmail
	}, function(err, doc){
		if(err){
			res.send("Error adding to db...." + err)
		}
		else{
			res.location("userlist");
			res.redirect("userlist");
		}
	});
});

/* POST for add new topic service. */
router.post('/addtopic', function(req, res){
	var db = req.db;
	var topicName = req.body.topicname;
	var topicLead = req.body.lead;
	var collection = db.get('topicscollection');

	collection.insert({
		"topicname" : topicName,
		"lead" : topicLead
	}, function(err, doc){
		if(err){
			res.send("Error adding to db.")
		}
		else{
			res.location("topicslist");
			res.redirect("topicslist");
		}
	});
});


module.exports = router;
