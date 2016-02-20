var fs = require('fs');
var config = require('./config_global');

var createEnvironment = function () {
  var environment = config.environment();
  // environment.directory ="Scheisse";
  environment.name = 'development';
  environment.file = '/development/nodeApp16Env.json';
  
  return environment;
};

module.exports = createEnvironment;