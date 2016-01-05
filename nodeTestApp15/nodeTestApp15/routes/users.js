var express = require('express');
var router = express.Router();
var request = require('request');

// GET for displaying create new user page
router.get('/create', function(req, res) {
  res.render('users/create.jade');
});

//POST for creating new User
router.post('/create', function(req, res) {
  var email = req.body.email;
  var pass = req.body.pass;

  request({
    url: 'http://172.17.0.3:8529/_db/nodeTestApp15/nodeTestApp15/credentials',
    method: 'POST',
    json: {
      username: email,
      password: pass
    }
  }, function (error, response, body) {
    if (!error && res.statusCode == 200) {
      res.location("Express");
      res.redirect("../");
    } else {
      console.log(error);
    }
  });
});

// GET for displaying login page
router.get('/login', function(req, res) {
  res.render('users/login.jade');
});

// POST for logging in user
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var pass = req.body.pass;

  request({
    url: 'http://172.17.0.3:8529/_db/nodeTestApp15/users/' + email + '/authenticate',
    method: 'PUT',
    json: {
      userId: email,
      password: pass
    }
  }, function (error, response, body) {
    if (!error && res.statusCode == 200) {
      console.log(response.statusCode);
      res.location("Express");
      res.redirect("../");
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
