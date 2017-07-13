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

function checkCorrect(input) {
	var password = input.value;
	var username = $('#username').val();
	input.setCustomValidity('');

	for(var i = 0; i < users.length; i++) {
		var user = users[i];
		if(user.username == username) {
			if(user.password != password) {
				input.setCustomValidity("The password you entered is incorrect.")
			}
		}
	}
}