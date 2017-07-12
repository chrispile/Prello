var boards;
var boardList;
var boardMenu;

$(function() {
	boardList = $('#boards');
	boardMenu = $('#boardMenuList');
	loadData();
	$('#closeBoardForm').click(closeBoardForm);
 	$('#addBoard').click(showBoardForm);
 	$('#boardSubmit').click(submitInput);
	$('#boardForm').submit(function(e) {
		event.preventDefault();
		return false;
	});
	boardList.on('click', 'li', navigateToBoard);
});

var showBoardForm = function() {
	$(this).css('display', 'none');
	$('#addBoardDiv').css('display', 'inline-block');
}


var loadData = function() {
	$.ajax( {
		url: "http://localhost:3000/boards",
		type: "GET",
		dataType: "json",
	})
	.done(function(json) {
		boards = json;
		loadMainList();
	});
}

var loadMainList = function() {
	for(var listIndex = 0; listIndex < boards.length; listIndex++) {
		var listLi = createBoard(listIndex);
		$('#addBoard').before(listLi);
	}
}



var closeBoardForm = function(event) {
	$('#boardInput').val('');
	var form = $(this).parent();
	$($(form).parent()).css('display', 'none');
	$('#addBoard').css('display', 'inline-block');
}



var submitInput = function() {
	var inputValue = $('#boardInput').val();
	if(inputValue != '') {
		$('#boardInput').val('');
		addBoard(inputValue);
		$('#addBoard').css("display", "inline-block");
		$('#addBoardDiv').css("display", "none");
	}
}

var addBoard = function(boardTitle) {
	$.ajax({
		url: "http://localhost:3000/boards",
		data: {
			'title': boardTitle,
		},
		type: "POST"
	}).done(function(json) {
		boards.push(json);
		var boardLi = createBoard(boards.length - 1);
		$('#addBoard').before(boardLi);
		var boardMenuLi = createBoardMenu(boards.length -1);
		boardMenu.append(boardMenuLi);

	});
}


var createBoard = function(boardIndex) {
	var listLi = $('<li/>').attr('data-boardindex', boardIndex).html(boards[boardIndex].title);
	return listLi;
}

var navigateToBoard = function() {
	var boardIndex = $(this).attr('data-boardindex');
	var boardID = boards[boardIndex]._id;
	window.location = "http://localhost:3000/board/" + boardID;
}

var createBoardMenu = function(boardIndex) {
	var boardID = boards[boardIndex]._id;
	var listLi = $('<li/>').attr('data-boardid', boardID).html(boards[boardIndex].title);
	return listLi;
}