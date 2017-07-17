var user;
var resetid;
$(function() {
	resetid = (window.location.href).split('/').pop();

	$('#resetPass').submit(function(event) {
		event.preventDefault();
		return false;
	});

	$('#resetSubmit').click(resetPass);

	$.ajax({
		url: "http://localhost:3000/reset/user/" + resetid, 
		type: "GET",
	}).done(function(res) {
		user = res;
	})
});


var checkPassword = function (input) {
	if(input.value != $('#password1').val() ) {
		input.setCustomValidity('Passwords must match!');
	} else {
		input.setCustomValidity('');
	}
}

var resetPass = function() {
	var newpassword = $('#password1').val();
	var email = user.email;
	$.ajax({
		url: "http://localhost:3000/users/",
		data: {
			'email': email, 
			'password': newpassword
		},
		type: "PATCH"
	}).done(function() {
		console.log('patched user passsword!');
	});
	$.ajax({
		url: "http://localhost:3000/reset/" + resetid,
		type: "DELETE"
	}).done(function() {
		console.log('deleted reset object!');
		$('#alert').css('display', 'block');
	})
}
