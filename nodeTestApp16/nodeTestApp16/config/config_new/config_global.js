var config = {
  environment: function () {
    var environment = {
      name: 'development',
      directory: '../../../nodeTestAppsEnvironments/nodeTestApp16Env',
      file:'/development/nodeApp16Env.json'
    };

    return environment;
  },
  web: function () {
    var web = {
      ip: '172.17.0.2'  // not used 
      http:
        port: 10010  // not used 
      https:
        port: 10011
        key: '/development/ssl/node/node-key.pem'
        crt: '/development/ssl/node/node-pub.pem'
    };

    return web;
  },
  db: function () {
    var db = {
      ip: '172.17.0.3'
      headers: {
        'Authorization': process.env.DB_PASS,
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=UTF-8'
      },
      http:
        port: 7474
      https:
        port: 7473
        ca: '/development/ssl/ca-root.pem'
        url: 'https://' + db.ip  + ':' + db.https.port + '/db/data/transaction/commit'
      request:
        method: 'POST'  // not used
      batch:
        url: 'https://' + config.db.ip  + ':' + config.db.https.port +'/db/data/batch';
        job:
          method: 'POST',
          url:'/cypher'
          id: 0
    };

    return db;
  },
  utils: {
    loadEnvironmentFile: function () {
      var env = {};
      if (fs.existsSync(config.environment.directory + config.environment.file)) {
        env = fs.readFileSync(config.environment.directory + config.environment.file, 'UTF-8');
        env = JSON.parse(env);
        Object.keys(env).forEach(function(key) {
          process.env[key] = env[key];
        });
      } else {
        console.log("No .env-file found.");
      }
      
      return env;
    },
    loadOtherFiles: function () {
      process.env.WEB_HTTPS_KEY = fs.readFileSync(config.environment.directory + config.web.https.key, 'utf8');
      process.env.WEB_HTTPS_CRT = fs.readFileSync(config.environment.directory + config.web.https.crt, 'utf8');
      process.env.DB_HTTPS_CA = fs.readFileSync(config.environment.directory + config.db.https.ca, 'utf8');

      // config.db.https.caRead = fs.readFileSync(config.environment.directory + config.db.https.ca, 'utf8');
    }
  }
};

module.exports = config;