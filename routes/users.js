var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Users = require('../models/user');


router.get('/', function(req, res, next) {
	Users.find(function(err, user) {
		res.json(user);
	});
});


router.post('/', function(req, res, next) {
	var newUser = new Users(
	{
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
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


module.exports = router;
