var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Users = require('../models/user');
var Reset = require('../models/reset');
var Sha1 = require('../sha1');

router.get('/', function(req, res, next) {
	Reset.find(function(err, resets) {
		res.json(resets);
	});
});

router.get('/user/:id', function(req, res, next) {
	Reset.findOne({id: req.params.id}, function(err, reset) {
		res.json(reset);
	});
});

router.post('/', function(req, res, next) {
	Users.findOne({email: req.body.email}, function(err, user) { 
		if(err) {
			console.log(err);
		}
		if(user) { //email exists
			//create unique random ID for reset link
			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			var id = Sha1.hash(current_date + random);

			//create and store reset in database
			Reset.findOne({email: req.body.email}, function(err, reset) {
				if(err) {
					console.log(err);
				}
				if(reset) { //a link exists already for email, so override the link
					reset.id = id;
				}
				else { //create a new link! 
					var reset = new Reset({
						email: req.body.email,
						id: id
					});
				}
				reset.save(function(err, reset) {
					if(err) {
						console.log(err);
					} else {
						var resetLink = "http://localhost:3000/reset/changepass/" + id;
	            		res.render('email', { title: "Email", resetLink: resetLink});
					}
				})
			})

		}
		else { //email does not exist
            res.render('reset', { title: "Email doesn't exist"});
		}
	});
});

router.delete('/:id', function(req, res) {
	var resetid = req.params.id;
	Reset.findOne({id: resetid}, function(err, reset) {
		if(err) {
			console.log(err);
		} else {
			reset.remove();
			res.send('');
		}
	});
});

router.get('/changepass/:id', function(req, res, next) {
	res.render('reset2', {title: 'Reset Password'})
});

module.exports = router;