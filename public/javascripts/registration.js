$(function() {
	$('#register').submit(function(e) {
		var password = $('#password1').val();
		var password2 = $('#password2').val();
		if(password != password2) {
        	alert('Passwords do not match!');
        	e.preventDefault();
		}
	});
});
