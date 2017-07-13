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


function checkPassword(input) {
	if(input.value != $('#password1').val() ) {
		input.setCustomValidity('Passwords must match!');
	} else {
		input.setCustomValidity('');
	}
}

function usernameTaken(input) {
	input.setCustomValidity('');
	for(var i = 0; i < users.length; i++) {
		var user = users[i];
		if(user.username == input.value) {
			input.setCustomValidity('Username already taken!');
			break;
		}
	}
}