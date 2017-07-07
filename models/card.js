var mongoose = require('mongoose');

var schema = mongoose.Schema({
		title: String,
		description: String,
		labels : Array,
		comments: Array,
		author: String
});

module.exports = mongoose.model('Card', schema);


