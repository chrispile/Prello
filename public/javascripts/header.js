var menuboards;
var boardMenu;

$(function() {
	boardMenu = $('#boardMenuList');
	loadData2();
	$('#logout').click(function() {
		window.location = "http://localhost:3000/logout";
	});
	boardMenu.on('click', 'li', navigateToBoard2);
});


var loadData2 = function() {
	$.ajax( {
		url: "http://localhost:3000/boards",
		type: "GET",
		dataType: "json",
	})
	.done(function(json) {
		menuboards = json;
		loadBoardMenu();
	});
}

var loadBoardMenu = function() {
	boardMenu.html('');
	for(var listIndex = 0; listIndex < menuboards.length; listIndex++) {
		var listLi = createBoardMenuLi(listIndex);
		boardMenu.append(listLi);
	}
}



var createBoardMenuLi = function(boardIndex) {
	var boardID = menuboards[boardIndex]._id;
	var title = menuboards[boardIndex].title;
	var listLi = $('<li/>').attr('data-boardid', boardID).html(title);
	return listLi;
}

var navigateToBoard2 = function() {
	var boardID = $(this).attr('data-boardid');
	window.location = "http://localhost:3000/board/" + boardID;
}