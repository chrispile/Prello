var mongoose = require('mongoose');

var schema = mongoose.Schema({
		title: String,
		users: Array
});

module.exports = mongoose.model('Board', schema);


