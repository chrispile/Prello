var boards;
var boardList;

$(function() {
	boardList = $('#boards');
	loadData();

	$('#addBoard').click(function() {
		$(this).css('display', 'none');
		$('#addBoardDiv').css('display', 'inline-block');
	});

	$('#closeBoardForm').click(closeBoardForm);

	$('#boardForm').submit(function(e) {
		event.preventDefault();
		return false;
	});

	$('#boardSubmit').click(submitInput);

	boardList.on('click', 'li', navigateToBoard);
});


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
	boardList.html('');
	for(var listIndex = 0; listIndex < boards.length; listIndex++) {
		var listLi = createBoard(listIndex);
		boardList.append(listLi);
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
		boardList.append(boardLi);
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