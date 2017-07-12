var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Board = require('../models/board');
var Users = require('../models/user');


router.get('/', function(req, res, next) {
	if(req.session.user != null) {
		Board.find({users: req.session.user.username}, function(err, boards) {
			if(err) {
				console.log(err);
			}
			else {
				res.json(boards);
			}
		});
	} else {
		res.send('');
	}
});


router.post('/', function(req, res) {
	var newBoard = new Board(
		{ 
			title: req.body.title,
			users: [req.session.user.username]
		}
		);
	newBoard.save(function (err, board) {
		if (err) {
			console.log(err);
		} else {
			res.json(board);
		}
	});
});


router.get('/:bid', function(req, res) {
	Board.findOne({_id: req.params.bid}, function(err, board) {
		if(err) {
			console.log(err);
		} else {
			res.json(board);
		}
	});
});

router.post('/:bid/user', function(req, res) {
	Users.findOne({username: req.body.username}, function(err, user) {
		if(err) {
			console.log(err);
		} else { 
			if(user != null) { //this user exists so you can add them to the board
				Board.findOne({_id: req.params.bid}, function(err, board) { 
					if(err) {
						console.log(err);
					} else {
						if(board.users.includes(req.body.username)) {
							res.send('in');
						}
						else {
							board.users.push(req.body.username);
							board.markModified("users");
							board.save(function(err, board) {
								if(err) {
									console.log(err)
								}
								else {
									res.json(board);
								}
							});
						}
					}
				});
			}
			else { //user does not exist, should not be able to add them to the board
				res.send('');
			}
		}
	});
});

router.get('/:bid/user', function(req, res) {
	Board.findOne({_id: req.params.bid}, function(err, board) { 
		if(err) {
			console.log(err);
		}
		else {
			res.json(board.users);
		}
	});
});



module.exports = router;