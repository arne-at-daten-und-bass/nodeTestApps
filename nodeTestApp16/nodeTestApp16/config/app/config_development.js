'use strict';

var fs = require('fs');

var appConfig = {
  environment: function() {
    var environment = {
      name: 'development',
      directory: '../../../nodeTestAppsEnvironments/nodeTestApp16Env',
      file:'/development/nodeApp16Env.json',
    };

    return environment;
  },

  web: function() {
    var web = {
      ip: '172.17.0.3', // not used
      http: {
        port: 10010, // not used
      },
      test: {
        port: 10011,
      },
      https: {
        port: 10011,
        key: '/development/ssl/node/node-key.pem',
        crt: '/development/ssl/node/node-pub.pem',
      },
    };

    return web;
  },

  db: function() {
    var db = {
      ip: '172.17.0.4',
      headers: {
        Authorization: process.env.DB_PASS,
        'Content-Type': 'application/json',
        Accept: 'application/json; charset=UTF-8',
      },
      http: {
        port: 7474,
      },
      https: {
        port: 7473,
        ca: '/development/ssl/ca-root.pem',

        // url: 'https://' + db.ip  + ':' + db.https.port + '/db/data/transaction/commit'
      },
      request: {
        method: 'POST'  // not used
      },
      batch: {
        // url: 'https://' + appConfig.db.ip  + ':' + appConfig.db.https.port +'/db/data/batch',
        job: {
          method: 'POST',
          url:'/cypher',
          id: 0,
        },
      },
    };

    db.https.url = 'https://' + db.ip  + ':' + db.https.port + '/db/data/transaction/commit';
    db.batch.url = 'https://' + db.ip  + ':' + db.https.port + '/db/data/batch';

    return db;
  },
};

(function loadEnvironmentFile () {
  var env = {};
  var file = appConfig.environment().directory + appConfig.environment().file;

  if (fs.existsSync(file)) {
    env = fs.readFileSync(file, 'UTF-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(function(key) {
      process.env[key] = env[key];
    });
  } else {
    console.log('No .env-file found.');
  }

  // return env;
})();

(function loadOtherFiles () {
  var directory = appConfig.environment().directory;
  
  process.env.WEB_HTTPS_KEY = fs.readFileSync(directory + appConfig.web().https.key, 'utf8');
  process.env.WEB_HTTPS_CRT = fs.readFileSync(directory + appConfig.web().https.crt, 'utf8');
  process.env.DB_HTTPS_CA = fs.readFileSync(directory + appConfig.db().https.ca, 'utf8');
})();

module.exports = appConfig;
