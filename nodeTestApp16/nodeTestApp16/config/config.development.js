var fs = require('fs');
var config = require('./config.global');
 
//general
config.environment.name = 'development';
config.environment.file = '/development/nodeApp16Env.json';
// config.hostname = 'development.example.com';

//nodeJS
// config.web.ip = '172.17.0.2';
//config.web.http.port = '3000';
config.web.https.port = '10011'; 
config.web.https.key = '/development/ssl/node/node-key.pem'; 
config.web.https.crt = '/development/ssl/node/node-pub.pem'; 

//neo4j
config.db.ip = '172.17.0.3';
config.db.http.port = '7474';
config.db.https.port = '7473';
config.db.https.ca = '/development/ssl/ca-root.pem'
config.db.url = 'https://' + config.db.ip  + ':' + config.db.https.port + '/db/data/transaction/commit';
// config.db.url = 'http://' + config.db.ip  + ':' + config.db.http.port + '/db/data/transaction/commit';

// Load ENV variables from json file
var env = {};
if (fs.existsSync(config.environment.directory + config.environment.file)) {
  env = fs.readFileSync(config.environment.directory + config.environment.file, 'UTF-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(function(key) {
    process.env[key] = env[key];
  });
}
else {
  console.log("No .env-file found.");
}

// Load ENV variables from other files
process.env.WEB_HTTPS_KEY = fs.readFileSync(config.environment.directory + config.web.https.key, 'utf8');
process.env.WEB_HTTPS_CRT = fs.readFileSync(config.environment.directory + config.web.https.crt, 'utf8');
// process.env.DB_CA = fs.readFileSync(config.environment.directory + config.db.ca, 'utf8');
// process.env.DB_HTTPS_CRT = fs.readFileSync(config.environment.directory + config.db.https.crt, 'utf8');
// process.env.DB_HTTPS_KEY = fs.readFileSync(config.environment.directory + config.db.https.key, 'utf8');
process.env.DB_HTTPS_CA = fs.readFileSync(config.environment.directory + config.db.https.ca, 'utf8');

config.db.https.caRead = fs.readFileSync(config.environment.directory + config.db.https.ca, 'utf8');


module.exports = config;
