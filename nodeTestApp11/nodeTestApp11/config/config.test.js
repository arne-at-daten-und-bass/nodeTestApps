var config = module.exports = {};

//General
config.environment = 'test';
config.hostname = 'test.example.com';

//NodeJS
config.nodejs.ip = '172.17.0.2';

//ArangoDB
config.arangodb.ip = '172.17.0.3';
config.arangodb.url = 'http://' + config.arangodb.ip + ':' + config.arangodb.port + '/_db/' + config.arangodb.db + '/' + config.arangodb.service; 

module.exports = config;
