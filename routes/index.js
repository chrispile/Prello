var express = require('express');
var router = express.Router();
var requireLogin = require('../authCheck');
var user = require('../models/user');


router.get('/', function(req, res, next) {
  res.render('registration', { title: 'Registration'});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});


router.post('/login', function(req, res) {
  user.findOne({ username: req.body.username }, function(err, user) {
    if (!user) {
 		res.render('login', { title: 'Invalid email or password'});
    } 
    else {
      if (req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } 
      else {
 		res.render('login', { title: 'Invalid email or password'});
      }
    }
  });
});

router.get('/dashboard', requireLogin, function(req, res) {
  res.render('boards', { title: 'Board Dashboard', username: res.locals.user.username });
});

router.get('/board/:bid', requireLogin, function(req, res) {
  res.render('index', { title: 'Board', username: res.locals.user.username, bid: req.params.bid});
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect("/");
});

module.exports = router;


