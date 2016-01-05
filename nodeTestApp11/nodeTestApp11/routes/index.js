var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NoSQL World' });
});

/* GET news page */
router.get('/news', function(req, res) {
  
  request.get(config.arangodb.url + '/news', function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var docs = JSON.parse(body);
      res.render('news', {
      'title' : 'NoSQL News',
      'newsList' : docs,
      'newsUrl': config.arangodb.url + '/news'
      });
    } else {
      console.log("Error while GETting DB API: " + err);
    }
  }).auth(config.arangodb.user , config.arangodb.pw , false);          
});

/* GET for add news page. */
router.get('/addnews', function(req, res) {
    res.render('addnews', { title: 'Add a news' });
});

/* POST for add news service */
router.post('/addnews', function(req, res) {
  
  request({
    url: config.arangodb.url + '/news',
    method: 'POST',
    json: {
      "title" : req.body.newsTitle,
      "author" : req.body.newsAuthor,
      "source" : req.body.newsSource,
      "url" : req.body.newsUrl,
      "snippet" : req.body.newsSnippet
    }
  }, function (error, response, body) {
    if (!error && res.statusCode == 200) {
      res.location("NoSQL News'");
      res.redirect("news");
    } else {
      console.log(error);
    }
  }).auth(config.arangodb.user , config.arangodb.pw , false);
});

/* GET for DELETE news */
router.get('/deletenews/:id', function(req, res) {

  request({
    url: config.arangodb.url + '/news/' + req.params.id,
    method: 'DELETE'
  }, function (error, response, body) {
    if (!error && res.statusCode == 200) {
      res.location("NoSQL News'");
      res.redirect("/../news");
    } else {
      console.log(error);
    }
  }).auth(config.arangodb.user , config.arangodb.pw , false);
});


/* GET database page. */
router.get('/databases', function(req, res) {
    var db = req.db;
    var collection = db.get('database_collection');
    collection.find({},{},function(e,docs){
        res.render('databases', {
        	'title': 'NoSQL Databases',
            'databasesList' : docs
        });
    });
});

///* GET for add database page */
router.get('/adddatabase', function(req, res) {
    res.render('adddatabase', { title: 'Add a database' });
});

/* POST for add database service */
router.post('/adddatabase', function(req, res) {

    var db = req.db;
    var databaseName = req.body.databaseName;
    var databaseType = req.body.databaseType;
    var dataPersistenceType = req.body.dataPersistenceType;
    var collection = db.get('database_collection');

    // Submit to the DB
    collection.insert({
        "name" : databaseName,
        "database_type" : databaseType,
        "data_persistence_type" : dataPersistenceType
    }, function (err, doc) {
        if (err) {
            res.send("Error while adding the information to the database.");
        }
        else {
            // Set the header to Redirect Page
            res.location("NoSQL Databases'");
            res.redirect("databases");
        }
    });
});

/* GET person page */
router.get('/persons', function(req, res) {
    var db = req.db;
    var collection = db.get('persons_collection');
    collection.find({},{},function(e,docs){
        res.render('persons', {
            'title': 'NoSQL Persons',
            'personsList' : docs
        });
    });
});


/* GET ONE person page */
router.get('/person/', function(req, res) {
    var db = req.db;
    var collection = db.get('persons_collection');
    collection.find({},{},function(e,docs){
        res.render('persons', {
            'title': 'NoSQL Persons',
            'personsList' : docs
        });
    });
});

/* GET for add person page. */
router.get('/addperson', function(req, res) {
    res.render('addperson', { title: 'Add a person' });
});

/* POST for add persons service */
router.post('/addperson', function(req, res) {

    var db = req.db;
    var personFirstName = req.body.personFirstName;
    var personLastName = req.body.personLastName;
    var personProfession = req.body.personProfession;
    var personEmail = req.body.personEmail;
    var personTwitter = req.body.personTwitter;
    var personGithub = req.body.personGithub;
    var collection = db.get('persons_collection');

    // Submit to the DB
    collection.insert({
        "first_name" : personFirstName,
        "last_name" : personLastName,
        "profession" : personProfession,
        "virtual_addresses": {
            "email" : personEmail,
            "twitter" : personTwitter,
            "github " : personGithub
        }
    }, function (err, doc) {
        if (err) {
            res.send("Error while adding the information to the database.");
        }
        else {
            // Set the header to Redirect Page
            res.location("NoSQL Persons'");
            res.redirect("persons");
        }
    });
});

module.exports = router;
