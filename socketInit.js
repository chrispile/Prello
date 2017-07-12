var instance;
var room;
module.exports = {
	getInstance: function() {
		return instance;
	},
	setup: function(server) {
		instance = require('socket.io')(server);
	    instance.on('connection', function(socket) {
	    	socket.on('joinRoom', function(bid) {
	    		room = bid;
	    		socket.join(room);
	    	});

	        socket.on('addCard', function(cardInfo) {
            	socket.broadcast.to(room).emit('cardAddReceived', cardInfo);
            });

            socket.on('deleteCard', function(cardInfo) {
            	socket.broadcast.to(room).emit('cardDeleteReceived', cardInfo);
            });

            socket.on('addList', function(json) {
            	socket.broadcast.to(room).emit('addListReceived', json);
            });

            socket.on('deleteList', function(listIndex) {
            	socket.broadcast.to(room).emit('deleteListReceived', listIndex);
            });


	    });

	}
}