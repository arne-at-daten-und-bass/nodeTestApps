var express = require('express');
var router = express.Router();

var request = require('request');
var neo4j = require('node-neo4j');

var host = '172.17.0.3';
var port = 7474;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/////////////////////////////////
//Tutorial Part 1 (HTTP REST API)
/////////////////////////////////
var dbRESTUrl ='http://neo4j:password@' + host + ':' + port + '/db/data/transaction/commit';

function runCypherQuery(query, params, callback) {
  request.post({
    uri: dbRESTUrl,
    json: {statements: [{statement: query, parameters: params}]}
  }, function(err, res, body) {
    callback(err,body);
  });
}

runCypherQuery('CREATE (someBody: Person { name: {name}, from: {company}, age: {age} } ) RETURN someBody', 
  {
    name: 'Ghuffran',
    company: 'Modulus',
    age: 44
  }, 
  function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  }
);


///////////////////////////////////
//Tutorial Part 2 node-neo4j Module
///////////////////////////////////

var dbModuleUrl = 'http://neo4j:password@' + host + ':' + port;

var db = new neo4j(dbModuleUrl);

// 1. Alternative
db.cypherQuery('CREATE (someBody: Person { name: {name}, from: {company}, age: {age} } ) RETURN someBody',
{
  name: 'Ghuffran',
  company: 'Modulus',
  age: ~~(Math.random() * 100)
},
function (err, res) {
  if(err) {
    console.log(err);
  } else {
    // CREATE worked, but repsond is empty
    console.log(res.data);
    console.log(res.columns);
  }
});

// 2. Alternative
db.insertNode({
  name: 'Ghuffran',
  company: 'Modulus',
  age: ~~(Math.random() * 100)
},
function (err, node) {
  if (err) {
    console.log(err);
  } else {
    console.log(node);
  }
});


module.exports = router;
