var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var list = require('./routes/list');

var user = require('./models/user');


var session = require('client-sessions');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongo');
});

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/list', list);


app.use(session({
  cookieName:'session',
  secret: 'random-string-goes-here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


app.post('/login', function(req, res) {
  user.findOne({ username: req.body.username }, function(err, user) {
    if (!user) {
      res.send('http://localhost:3000/');
    } 
    else {
      if (req.body.password === user.password) {
        req.session.user = user;
        res.send('http://localhost:3000/boards');
      } 
      else {
        res.send('http://localhost:3000/');
      }
    }
  });
});

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    user.findOne({ username: req.session.user.username}, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/boards', requireLogin, function(req, res) {
  res.render('boards', { title: 'Express', style: 'stylesheets/boards_stylesheet.css', username: res.locals.user.username});
});

app.get('/board', requireLogin, function(req, res) {
  res.render('index', { title: 'Express', style: 'stylesheets/board_stylesheet.css', username: res.locals.user.username});
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.send('http://localhost:3000/')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
