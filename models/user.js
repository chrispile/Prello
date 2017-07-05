var mongoose = require('mongoose');

var schema = new mongoose.Schema( {
	username: String,
	email: String,
	password: String,
	lists: []
});


module.exports = mongoose.model('User', schema);