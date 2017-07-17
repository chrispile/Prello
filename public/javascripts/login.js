var users;
$(function() {
	$.ajax( {
		url: "http://localhost:3000/users",
		type: "GET",
	})
	.done(function(json) {
		users = json;
	});
});

function usernameExist(input) {
	var username = input.value;
	input.setCustomValidity('Username does not match any account.')
	for(var i = 0; i < users.length; i++) {
		if(users[i].username == username) {
			input.setCustomValidity('');
		}
	}
}
