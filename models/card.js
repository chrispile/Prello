var mongoose = require('mongoose');

var schema = mongoose.Schema({
		title: String,
		description: String,
		labels : Array,
		comments: Array
});

module.exports = mongoose.model('Card', schema);


