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
	var alreadyExists = Users.findOne({username: req.body.username}, function(err, user) {
		if(user == null) {
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
		}
		else {
			 res.render('registration', { title: 'Username already exists', style: 'stylesheets/registration_stylesheet.css'});
		}
	});

});


module.exports = router;
