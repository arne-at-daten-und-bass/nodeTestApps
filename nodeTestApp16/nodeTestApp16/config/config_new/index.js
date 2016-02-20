var environment = function () {
  return process.env.NODE_ENV || 'development';
};
var config = require('./config_' + environment());
var config2 = require('./config_' + environment());
// console.log(config());
// config.name = 'changed';
console.log(config());
console.log(config2());
console.log(config() === config2());
console.log(config() == config2());

module.exports = config;