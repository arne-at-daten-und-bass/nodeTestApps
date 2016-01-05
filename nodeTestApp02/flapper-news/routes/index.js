var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* Parameters for PRELOADING all posts*/
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err) { return next(err); }
		if(!post) { return nex (new Error('Cannot find Post')); }

		req.post = post;
		return next();
	});
});

/* Parameters for PRELOADING all comments*/
router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err) { return next(err); }
		if(!comment) { return next (new Error('Cannot find Comment')); }

		req.comment = comment;
		return next();
	});
});

/* GET home page.*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET all posts page. */
router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if(err) { return next(err); }

		res.json(posts);
	});
});

/* GET single post page. */
router.get('/posts/:post', function(req, res, next){
	req.post.populate('comments', function(err, post){
		if (err) { return next(err); }
	
		res.json(post);
	});
});

/* PUT upvote method for a certain post. */
router.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if(err) { return next(err); }

		res.json(post);
	});
});

/* PUT upvote method for a certain comment. */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
	req.comment.upvoteComment(function(err, comment){
		if(err) { return next(err); }

		res.json(comment);
	});
});


/* POST new posts page. */
router.post('/posts', function(req, res, next){
	var post =  new Post(req.body);
		post.save(function(err,post){
			if (err) { return net(err); }	

			res.json(post);
	});
});

/* POST new comment page. */
router.post('/posts/:post/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if(err) { return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err) { return next(err); }

			res.json(comment);
		});
	});
});

		
module.exports = router;
