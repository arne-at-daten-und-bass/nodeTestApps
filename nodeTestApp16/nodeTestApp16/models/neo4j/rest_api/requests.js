'use strict';

var request = require('request');

var requests = {
  db: function (dbConfig) {
    return { 
      cypherRequest: function(query, params, resultType, includeStats, callback) {
        console.log(query);
        // console.log(JSON.stringify(params));
        request.post({
          headers: dbConfig.headers,
          url: dbConfig.https.url,
          ca: process.env.DB_HTTPS_CA,
          json: { statements: [{ statement: query, parameters: params, resultDataContents: resultType, includeStats: includeStats }] }, 
        }, function(err, res) {
           console.log(JSON.stringify(err));
            callback(err, res.body);
          }
        );
      },

      cypherBatch: function(query0, params0, query1, params1, callback) {
        request.post({
          headers: dbConfig.headers,
          url: dbConfig.batch.url,
          ca: process.env.DB_HTTPS_CA,
          json: [ {
            method: dbConfig.batch.job.method,
            to: dbConfig.batch.job.url,
            body: {
              query: query0,
              params: params0,
            },
            id: 0,
          }, {
            method: dbConfig.batch.job.method,
            to: dbConfig.batch.job.url,
            body: {
              query: query1,
              params: params1,
            },
            id: 1,
          }, ], 
        }, function(err, res) {
            // console.log(err);
            // console.log(res);
            callback(err, res.body);
          }
        );
      },
    };
  },
};

module.exports = requests;
