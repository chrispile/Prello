var mongoose = require('mongoose');

var schema = new mongoose.Schema( {
	email: String,
	id: String
});


module.exports = mongoose.model('Reset', schema);