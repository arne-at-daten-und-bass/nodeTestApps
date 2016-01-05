var express = require('express');
var router = express.Router();

/* GET User List */
router.get('/userlist', function(req, res){
	var db = req.db;
	db.collection('userlist').find().toArray(function(err, items){
		res.json(items);
	});
});

/* POST to add new user*/

router.post('/adduser', function(req, res){
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send(
				(err === null) ? { msg: '' } : { msg: err }
			);
	});
});

/* PUT to update uswer */

router.put('/updateuser/:id', function(req, res){
	var db = req.db;
	var userToUpdate = req.params.id;
	db.collection('userlist').updateById(userToUpdate, req.body, function(err, result){
		res.send((result === 1) ? { msg : ''} : {msg : 'Error: ' + err});
	});
});


/* DELETE to delete user*/
router.delete('/deleteuser/:id', function(req, res){
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result){
		res.send((result === 1) ? { msg: '' } : { msg: 'Error: ' + err});
	});
});

module.exports = router;
