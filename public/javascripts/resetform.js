function emailExists(input) {
	var email = input.value;
	$.ajax({
		url: "http://localhost:3000/users/exists/" + email, 
		type: "GET",
	}).done(function(res) {
		if(res == true) {
			input.setCustomValidity('');
		}
		else {
			input.setCustomValidity('Username does not match any account.')
		}
	})
}