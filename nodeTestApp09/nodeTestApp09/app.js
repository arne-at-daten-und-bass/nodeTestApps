var mongoose = require('mongoose');
var express = require('express');

//mongoose query and promise support to express
require('express-mongoose');

var models = require('./models');
var middleware = require('./middleware');
var routes = require('./routes');

// changed for docker:
// mongoose.connect('mongodb://localhost/nosqlblog', function(err) {
mongoose.connect('mongodb://172.17.0.3/nosqlblog', function(err) {
	if (err) {
		throw err;
	}

	console.log('connected!');

	var app = express();
	middleware(app);
	routes(app);

	app.listen(3000, function() {
		console.log('now listening on http://localhost:3000');
	});
});