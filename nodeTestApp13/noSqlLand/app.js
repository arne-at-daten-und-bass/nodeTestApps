/**
 * Requirements
 * @type {object}
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var ConnectMongo = require('connect-mongo')(session);
var forceSSL = require('express-force-ssl');
var config = require('./config');

/**
 * @description Adds mongoose query and promise support to express  (used for lookups for referenced entities such as comments e.g.)
 * 
 */
require('express-mongoose');

/**
 * Mongoose Requirements and required models
 * @type {object}
 */
var mongoose = require('mongoose');
require('./models/user-model');
require('./models/post-model');
require('./models/database-model');
require('./models/person-model');
require('./models/comment-model');

// changed for docker and config-file
// mongoose.connect('mongodb://localhost/nosqlland');
// mongoose.connect('mongodb://172.17.0.3/nosqlland');
mongoose.connect(config.db.url + '?authSource=nosqlland', {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  server: {
    ssl: true,
    sslCA: process.env.DB_CA,
    sslKey: process.env.WEB_KEY,
    sslCert: process.env.WEB_CRT,
    sslPass: process.env.WEB_KEY_PASS
  }
});

//console.log(config.db.user);
//console.log(process.env.NODE_ENV);

/**
 * Routes definitionn for app use statement
 * @type {object}
 */
var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var databases = require('./routes/databases');
var persons = require('./routes/persons');

var app = express();

// Force to use ONLY HTTPS
app.set('httpsPort', config.web.https.port);
app.use(forceSSL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * MongoDb for User Sessions
 * @type {function}
 */
app.use(session({
  secret: process.env.WEB_SESSION_KEY,
  store: new ConnectMongo({ mongooseConnection: mongoose.connection })
}));

/**
 * Expose session to views
 * @type {function}
 * @param  {object}   req     Request
 * @param  {object}   res     Response
 * @param  {function} next    Next function in loop
 */
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

/**
 * Routes used predefined
 * @type {function}
 */
app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/databases', databases);
app.use('/persons', persons);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
