var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// // nodeTestApp05: Database connection parameters:
// // initial, one-time only createDatabase
// var arangoDB = require('arangojs');
// // IP address changed for docker
// // var dbConnection = arangoDB('http://127.0.0.1:8529');
// var dbConnection = arangoDB('http://172.17.0.3:8529');
// var nodeTestApp05 = dbConnection.createDatabase('nodeTestApp05', function(err, newdb) {
//   if (err) {
//     console.log('Failed to create database: %j', err);
//   } else {
//     console.log('Database created: %j', newdb.name);
//     nodeTestApp05 = newdb;
//   }
// });



// Get the initially created database
var arangoDB = require('arangojs');
// IP address changed for docker
// var dbConnection = arangoDB('http://127.0.0.1:8529');
var dbConnection = arangoDB('http://172.17.0.3:8529');
var nodeTestApp05 = dbConnection.database('nodeTestApp05', function (err, database) {
    if (err) {
      console.log('Failed to connect to database: %j', err);
    } else {
      console.log('Connected to database: %j', database.name);
      nodeTestApp05 = database;
      //// initial, one-time only createCollections
      // nodeTestApp05.createCollection('database_collection', function (err, collection) {
      //   if (err) {
      //     return console.error(err);
      //   } else {
      //     console.log('Collection created: %j', collection.name);
      //   }
      // });
      // Get the initially created collection and load it into memory
      nodeTestApp05.collection('database_collection', function (err, collection) {
        if (err) {
          console.log('Failed to connect to collection: %j', err);
        } 
        else {
          collection.load(false, function (err) {
            if (err) {
              console.log('Failed to load to collection: %j', err);
            }
            else {
              console.log('Collection loaded: %j', collection.name);
              // collection.save({ a: 'foo', b: 'bar', c: Date() }, function(err, result){
              //   if(err) {
              //     console.log('Error: %j', err);
              //   }
              //   else{
              //     console.log('Result: %j', result._id);
              //   }
              // });
              // collection.document('9505526186', function(err, result) {
              //   if(err) { 
              //     console.log('Error: %j', err);
              //   }
              //   else{
              //     console.log(JSON.stringify(result, undefined, 2));
              //   }
              // });
              // collection.update('9505526186', { d: 'qux' }, function(err, result){
              //   if(err) {
              //     console.log('Error: 5j', err);
              //   }
              //   else {
              //     console.log('Result: %j', result._id);
              //     console.log(JSON.stringify(result, undefined, 2));
              //   }
              // });
              // for (var i = 0; i < 10; i++) {
              //   collection.save({ a: 'doc_'+i }, function(err, result) {
              //     if(err) { 
              //       console.log('Error: %j', err);
              //     }
              //     else{
              //       console.log('Result: %j', result._id);
              //     }
              //   });
              // }
              // collection.all('key', function(err, keys) {
              //   if(err) { 
              //     console.log('Error: %j', err);
              //   }
              //   else{
              //     console.log('All docs a key: %j', keys);
              //   }
              // });
              // collection.remove('9505526186', function(err, result) {
              //   if(err) {
              //     console.log('Error: %j', err);
              //   }
              //   else{
              //     console.log('Result: %j', result);
              //   }
              // });
            }
          });
        }
    });
  } 
});   


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// nodeTestApp05: Router database access
app.use(function(req,res,next){
    req.db = db;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
