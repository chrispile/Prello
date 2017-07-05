$('#logout').click(function() {
	var username = $('#username').val();
	var password = $('#password').val();

	$.ajax({
		url: "http://localhost:3000/logout",
		type:"GET",
	})
	.done(function(data) {
		window.location = data;
	})
	.fail(function(xhr, textStatus, errorThrown) {
		alert(xhr.responseText);
	});

});