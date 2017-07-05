$(function() {
	$('#register').submit(register);
	$('#login').submit(login);
});


var register = function() {
	var username = $('#usernameReg').val();
	var email = $('#emailReg').val();
	var password = $('#passwordReg').val();
	var password2 = $('#confirmPasswordReg').val();
	if (password == password2) {
		$.ajax({ 
			url: "http://localhost:3000/users",
			data: {
			'username': username,
			'email': email,
			'password': password,
			'lists': []
			},
			type: "POST",
		}).done(function(json) {
			console.log('New user registered!');
			window.location = 'http://localhost:3000/';
		}).fail(function(xhr, textStatus, errorThrown) {
			alert(xhr.responseText);
		});
	}
	else {
		alert('passwords do not match!');
		//implement a notification in UI later
	}
	event.preventDefault();
	return false;
}

var login = function() {
	var username = $('#username').val();
	var password = $('#password').val();

	$.ajax({
		url: "http://localhost:3000/login",
		data: {
			username: username,
			password: password
		},
		type:"POST",
	})
	.done(function(data) {
		window.location = data;
	})
	.fail(function(xhr, textStatus, errorThrown) {
		alert(xhr.responseText);
	});
	event.preventDefault();
	return false;
}