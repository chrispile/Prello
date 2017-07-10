var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Board = require('../models/board');



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


module.exports = router;