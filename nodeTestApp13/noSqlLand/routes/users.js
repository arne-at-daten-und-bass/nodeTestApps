/**
 * [express description]
 * @type {[type]}
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('Users');
var cleanString = require('../utils/cleanString');
var hash = require('../utils/hash');
var crypto = require('crypto');
var showAll = require('./show-all');
var showOne = require('./show-one');
var showEdit = require('./show-edit');
var commentOne = require('./comment-one');
var deleteOne = require('./delete-one');

/**
 * GET listing for all users see file './show-all.js')
 * @type {function}
 */
router.get('/show-all', function(req, res, next) {
  showAll('users/show-all', User, req, res, next);
});

/**
 * GET for displaing existing user (see file './show-one.js')
 * @type {function}
 */
router.get('/id/:id', function(req, res) {
  showOne('users/view', User, req, res);
});

/**
 * GET for displaying create new user page
 * @type   {function}
 * @param  {object} req   Request
 * @param  {object} res   Response
 */
router.get('/create', function(req, res) {
  res.render('users/create.jade');
});

/**
 * POST for creating new User
 * @type {function}
 * @param  {object}   req     Request
 * @param  {object}   res     Response
 * @param  {function} next    Next function in loop
 * @todo @return {[type]}     [description]
 */
router.post('/create', function(req, res, next) {
  var email = cleanString(req.param('email'));
  var pass = cleanString(req.param('pass'));
  var firstName = req.param('firstName');
  var lastName = req.param('lastName');

  if (!(email && pass)) {
    return res.render('create.jade', {
      invalid: true
    });
  }

  User.findById(email, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.render('create.jade', {
        exists: true
      });
    }

    crypto.randomBytes(16, function(err, bytes) {
      if (err) {
        return next(err);
      }

      var user = {
        _id: email,
        name: {
          first: firstName,
          last: lastName
        }
      };
      user.salt = bytes.toString('utf8');
      user.hash = hash(pass, user.salt);

      User.create(user, function(err, newUser) {
        if (err) {
          if (err instanceof mongoose.Error.ValidationError) {
            return res.render('create.jade', {
              invalid: true
            });
          }
          return next(err);
        }

        // user created successfully
        req.session.isLoggedIn = true;
        req.session.user = email;
        return res.redirect('/users/id/' + user._id);
      });
    });
  });
});

/**
 * GET for displaying login page
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {             res.render('users/login.jade');} [description]
 * @return {[type]}      [description]
 */
router.get('/login', function(req, res) {
  res.render('users/login.jade');
});

/**
 * POST for logging in user
 * @type {function}
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {             var email [description]
 * @return {[type]}       [description]
 */
router.post('/login', function(req, res, next) {
  var email = cleanString(req.param('email'));
  var pass = cleanString(req.param('pass'));
  
  if (!(email && pass)) {
    return invalid();
  }

  email = email.toLowerCase();

  User.findById(email, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return invalid();
    }
    if (user.hash != hash(pass, user.salt)) {
      return invalid();
    }

    //valid user entered and found  
    req.session.isLoggedIn = true;
    req.session.user = email;
    res.redirect('/');
  });

  function invalid() {
    return res.render('users/login.jade', {
      invalid: true
    });
  }
});

/**
 * GET for logging out user
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {             req.session.isLoggedIn [description]
 * @return {[type]}      [description]
 */
router.get('/logout', function(req, res) {
  req.session.isLoggedIn = false;
  req.session.user = null;
  res.redirect('/');
});

/**
 * GET for showing edit user page, only for logged in users (see file './show-edit.js')
 * @type {function}
 */
router.get('/edit/:id', function(req, res, next) {
  showEdit(User, 'users/create.jade', req, res, next);
});

/**
 * POST for actually editing an existing user, only for logged in users 
 * @type {function}
 * @todo @param  {[type]} req   [description]
 * @todo @param  {[type]} res   [description]
 * @todo @param  {[type]} next) {             var id [description]
 * @todo @return {[type]}       [description]
 */
router.post('/edit/:id', function(req, res, next) {
  var id = req.param('id');
  var pass = cleanString(req.param('pass'));
  var firstName = req.param('firstName');
  var lastName = req.param('lastName');

  User.findById(id, function(err, user) {
    if (err) {
      return next(err);
    }

    crypto.randomBytes(16, function(err, bytes) {
      if (err) {
        return next(err);
      }

      var userSalt = bytes.toString('utf8');
      var userHash = hash(pass, userSalt);
      var update = {
        $set: {
          name: {
            first: firstName,
            last: lastName
          },
          salt: userSalt,
          hash: userHash
        }
      };

      User.findByIdAndUpdate(id, update, function(err, updatedUser) {
        if (err) {
          return next(err);
        }
        
        return res.redirect('/users/id/' + user._id);
      });
    });
  });
});

/**
 * POST for commenting on a user, only for users logged in (see file './comment-one.js')
 * @type {function}
 */
router.post('/comment/:id', function(req, res, next) {
  commentOne(User, '/users', req, res, next);
});

/**
 * GET for deleting one user entity, only for the logged in user (see file './delete-one.js')
 * @type {function}
 */
router.get('/remove/:id', function(req, res, next) {
  deleteOne(User, '/users', req, res, next);
});

/**
 * Exports
 * @type {function}
 */
module.exports = router;