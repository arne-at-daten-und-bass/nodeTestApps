'use strict';

var Foxx = require('org/arangodb/foxx');
var controller = new Foxx.Controller(applicationContext);

var Credentials = require('../models/credentials');
var SimpleAuth = Foxx.requireApp('/simple-auth');
var Users = Foxx.requireApp('/users-local');

// Create a new user with a given username and password
controller.post('/', function (req, res) {

  require("console").dir(req.params('credentials'));
  // var username = req.body().username;
  // var password = SimpleAuth.hashPassword(req.body().password);
  // var user = Users.create(username, {}, { simple: password });

  var credentials = req.params('credentials');
  var username = credentials.get('username');
  var password = SimpleAuth.hashPassword(credentials.get('password'));
  var user = Users.create(username, {}, { simple: password });

  res.status(200);
  res.json({
    username: username,
    password: password
  });
}).bodyParam('credentials', {
  description: 'Username and password',
  type: Credentials
  });;

controller.activateSessions({
  type: 'cookie',
  cookie: {
    secret: 'jijidjdidjeckk2938'
  }
});

