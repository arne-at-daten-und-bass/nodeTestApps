var fs = require('fs');
var config = require('./config.global');
 
//general
config.environment.name = 'development';
config.environment.file = ('/development/nodeTestApp15Env.json');
// config.hostname = 'development.example.com';

//nodeJS
// config.web.ip = '172.17.0.2';
// config.web.key = '/development/sslDBExternal/clientNodeIP.key'
// config.web.crt = '/development/sslDBExternal/clientNodeIP.crt'
config.web.http.port = '3000';
config.web.https.port = '3001'; 
config.web.https.key = '/development/sslWeb/my-open-ssl.key'; 
config.web.https.crt = '/development/sslWeb/my-open-ssl.crt'; 

//mongoDB
// config.db.ip = '172.17.0.3';
// config.db.url = 'mongodb://' + config.db.ip + '/' + config.db.db;
// config.db.ca = '/development/sslDBExternal/mongodbDockerIP.pem';


// Load ENV variables from json file
var env = {};
if (fs.existsSync(config.environment.directory + config.environment.file)) {
	env = fs.readFileSync(config.environment.directory + config.environment.file, 'UTF-8');
	env = JSON.parse(env);
	Object.keys(env).forEach(function(key) {
		process.env[key] = env[key];
		console.log(process.env[key]);
	});
}
else {
	console.log("No .env-file found.");
}

// Load ENV variables from other files
// process.env.WEB_KEY = fs.readFileSync(config.environment.directory + config.web.key, 'utf8');
// process.env.WEB_CRT = fs.readFileSync(config.environment.directory + config.web.crt, 'utf8');
process.env.WEB_HTTPS_KEY = fs.readFileSync(config.environment.directory + config.web.https.key, 'utf8');
process.env.WEB_HTTPS_CRT = fs.readFileSync(config.environment.directory + config.web.https.crt, 'utf8');
// process.env.DB_CA = fs.readFileSync(config.environment.directory + config.db.ca, 'utf8');


module.exports = config;
