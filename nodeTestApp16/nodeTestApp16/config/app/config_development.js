'use strict';

var fs = require('fs');

var appConfig = {
  environment: function() {
    var environment = {
      name: 'development',
      // directory: '../../../nodeTestAppsEnvironments/nodeTestApp16Env/development/',
      directory: process.env.APP_CONFIG_ENV_DIR,
      file:'nodeTestApp16Env.json',
    };
    console.log(process.env.APP_CONFIG_ENV_DIR);
    return environment;
  },

  web: function() {
    var web = {
      ip: '192.168.3.11', // not used
      http: {
        port: 10010, // not used
      },
      https: {
        port: 10011,
        // key: '/etc/ssl/dev01s03_wb01_key.pem',
        key: process.env.APP_CONFIG_ENV_DIR + 'dev01s03_wb01_key.pem',
        crt: process.env.APP_CONFIG_ENV_DIR + 'dev01s03_wb01_pub.pem',
        // key: 'pki/nodejs/nodejs_nodeTestApp16Dev_key.pem',
        // crt: 'pki/nodejs/nodejs_nodeTestApp16Dev_pub.pem',
      },
    };

    return web;
  },

  db: function() {
    var db = {
      ip: '192.168.3.12',
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
        // ca: '/etc/ssl/ca_nodeTestApp16Dev_root.pem',
        // ca: 'pki/ca_nodeTestApp16Dev_root.pem',
        ca: process.env.APP_CONFIG_ENV_DIR + 'ca_nodeApp01Dev_root.pem',
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

  // if (fs.existsSync(file)) 
  try {
    env = fs.readFileSync(file, 'UTF-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(function(key) {
      process.env[key] = env[key];
    });
  } catch (err) {
    if(err.code === 'ENOENT') {
      console.log('No .env-file found.');
    } else {
      console.log('Reading .env-file failed.');
    }
    throw (err);
  }
})();

(function loadOtherFiles () {
  var directory = appConfig.environment().directory;
  
  process.env.WEB_HTTPS_KEY = fs.readFileSync(directory + appConfig.web().https.key, 'utf8');
  process.env.WEB_HTTPS_CRT = fs.readFileSync(directory + appConfig.web().https.crt, 'utf8');
  process.env.DB_HTTPS_CA = fs.readFileSync(directory + appConfig.db().https.ca, 'utf8');
})();

module.exports = appConfig;
