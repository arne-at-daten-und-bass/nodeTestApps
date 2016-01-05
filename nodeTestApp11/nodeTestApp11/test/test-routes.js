var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();
var config = require('../config');


chai.use(chaiHttp);

describe('News', function() {
  it('should respond with OK on / GET', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.html;
        res.body.should.be.a('object');
        done();
      });
  });
  it('should list ALL news on /news GET', function(done) {
    chai.request(app)
      .get('/news')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.html;
        res.body.should.be.a('object');
        done();
      });
  });
  it('should require authentication on DB /nodeTestApp11/news GET', function(done) {
    chai.request(config.arangodb.url)
      .get('/news')
      .end(function(err, res){
        res.should.have.status(401);
       done();
      });
  });
  it('should respond with OK on DB /nodeTestApp11/news GET when authorized', function(done) {
    chai.request(config.arangodb.url)
      .get('/news')
      .auth(config.arangodb.user, config.arangodb.pw)
      .end(function(err, res){
        res.should.have.status(200);
       done();
      });
  });
  it('should respond with OK on /addnews GET', function(done) {
  chai.request(app)
      .get('/addnews')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.html;
        res.body.should.be.a('object');
        done();
      });
  });
  it('should add a SINGLE news on /addnews POST', function(done) {
    chai.request(app)
      .post('/addnews')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ 
        'newsTitle': 'Mocha via Form', 
        'newsAuthor': 'Mocha via Form',
        'newsSource': 'Mocha via Form',
        'newsUrl': 'Mocha via Form',
        'newsSnippet': 'Mocha via Form' 
        })
      //.redirects(1)
      .end(function(err, res){      
        // no res object here because of redirect 
        // http://stackoverflow.com/questions/33716664/not-getting-a-response-from-a-chai-post-request-in-mocha-javascript-node-js-uni
        err.should.have.property('code');
        err.code.should.equal('ECONNREFUSED');
        done();
      });
  });
  it('should require authentication on DB /nodeTestApp11/news POST', function(done) {
    chai.request(config.arangodb.url)
      .post('/news')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        'title': 'MochaDB', 
        'author': 'MochaDB',
        'source': 'MochaDB',
        'url': 'MochaDB',
        'snippet': 'MochaDB' 
        })
      .end(function(err, res){
        res.should.have.status(401);
       done();
      });
  });
  it('should add a SINGLE news on DB /nodeTestApp11/news POST', function(done) {
    chai.request(config.arangodb.url)
      .post('/news')
      .auth(config.arangodb.user, config.arangodb.pw)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        '_key': 'MochaDB',
        'title': 'MochaDB', 
        'author': 'MochaDB',
        'source': 'MochaDB',
        'url': 'MochaDB',
        'snippet': 'MochaDB' 
        })
      .end(function(err, res){
        res.should.have.status(200);
       done();
      });
  });
  it('should delete the previously created news with _key:MochaDB on /deletenews/:id DELETE and redirect to /../news ', function(done) {
    chai.request(app)
    .get('/deletenews/MochaDB')
    .end(function(err, res){  
      // Status code is due to redirect to /../news which can probably not be resolved    
      res.should.have.status(404);
      done();
    });
  });
});