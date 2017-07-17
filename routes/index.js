var express = require('express');
var router = express.Router();
var requireLogin = require('../authCheck');
var permissionsCheck = require('../permissionsCheck');

var user = require('../models/user');
var io = require('../socketInit');
var Sha1 = require('../Sha1');


router.get('/', function(req, res, next) {
  res.render('registration', { title: 'Registration'});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', alert: 'none'});
});


router.post('/login', function(req, res) {
    user.findOne({ username: req.body.username }, function(err, user) {
        if (!user) { //user does not exist
            res.render('login', { title: 'Invalid email or password', alert:'none'});
        } 
        else {
            var encryptPass = Sha1.hash(req.body.password);
            if (encryptPass === user.password) { 
                req.session.user = user;
                res.redirect('/dashboard');
            } 
            else { //passwords do not match
                res.render('login', { title: 'Invalid email or password', alert: 'block'});
            }
        }
    });
});

router.get('/dashboard', requireLogin, function(req, res) {
  res.render('boards', { title: 'Board Dashboard', username: res.locals.user.username });
});

router.get('/board/:bid', requireLogin, permissionsCheck, function(req, res) {
    res.render('index', { title: 'Board', username: res.locals.user.username});
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect("/");
});

router.get('/reset', function(req, res) {
  res.render('reset', { title: 'Forgot Password'})
});

module.exports = router;


