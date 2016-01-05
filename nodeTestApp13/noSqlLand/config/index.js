var environment = process.env.NODE_ENV || 'development';
var config = require('./config.' + environment);

module.exports = config;