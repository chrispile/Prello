var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Users = require('../models/user');
var Sha1 = require('../sha1');

router.get('/', function(req, res, next) {
	Users.find(function(err, user) {
		res.json(user);
	});
});

router.post('/', function(req, res, next) {
	var encryptPass = Sha1.hash(req.body.password);
	var newUser = new Users(
	{
		username: req.body.username,
		email: req.body.email,
		password: encryptPass,
		boards: []
	});
	newUser.save(function(err, user) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/login'); 	
		}
	});
});

router.get('/exists/:email', function(req, res, next) {
	Users.findOne({email: req.params.email}, function(err, user) {
		if(err) {
			console.log(err);
		}
		if(user) {
			res.send(true);
		}
		else {
			res.send(false);
		}
	});
});

router.patch('/', function(req, res, next) {
	Users.findOne({email: req.body.email}, function(err, user) {
		if(user) {
			user.password = Sha1.hash(req.body.password);
			user.save(function(err, user) {
				if(err) {
					console.log(err);
				}
				else {
					res.json(user);
				}
			})
		}
		else {
			console.log('user not found!')
		}
	})
})


module.exports = router;
