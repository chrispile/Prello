var Board = require('./models/board');

module.exports = function(req, res, next) {
	Board.findOne({_id: req.params.bid}, function(err, board) {
		var users = board.users;
		if(users.includes(req.user.username)){
			next();
		} else {
  			res.render('boardNotFound', { title: 'Board Not Found', username: res.locals.user.username});
		}
	});
}; 
