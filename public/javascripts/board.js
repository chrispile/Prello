var lol;
var mainList;
var bid = (window.location.href).split('/').pop();
var board;
var socket;
$(function() {
	lol = $('#outerList');
	loadData();
	socket = io();
	socket.emit('joinRoom', bid);

	$('#listForm').submit(function(event) {
		event.preventDefault();
		return false;
	});
	$('.cardForm').submit(function(event) {
		event.preventDefault();
		return false;
	});
	$('#usersForm').submit(function(event) {
		event.preventDefault();
		return false;
	})

	lol.on('click', '.deleteList', deleteList);
	lol.on('click', '.cardList li', showModal);
	lol.on('click', '.addCard', showCardInput);
	lol.on('click', '.submitCard', submitCard);
	lol.on('click', '.closeCardForm', closeCardForm);

	$('#addListSpan').click(showInput);
	$('#listSubmit').click(submitInput);
	$('#cardModal').click(hideModal);
	$('#deleteCard').click(deleteCard);
	$('#labelDiv ul li').each(labelColors);
	$('#addLabelsButton').click(showLabels);
	$('#labelDiv ul li').click(addLabels);
	$('#closeListForm').click(closeListForm);
	$('#saveComment').click(saveComment);
	$('#addUsersButton').click(toggleAddUsers);
	$('#userSubmit').click(addUser);
	$('#saveDesc').click(saveDesc);

	lol.on('click', '.cardForm', function(event) {
		event.stopPropagation();
	});
	$('#addList').click(function(event){
		event.stopPropagation();
	});
	$(document).click(function(){
		$('#addListSpan').css('display', 'inline-block');
		$('#addList').css('display', 'none');
		$('.addCardDiv').css('display', 'none');
		$('.addCard').css('display', 'block');
		$('.cardInput').val('');
		$('#listInput').val('');

	});



	$(document).ready(function() {
		var height = $(document).height();
		height = height - 100;
		$(".list").css('max-height', height.toString());

	})


	socket.on('cardAddReceived', function(cardInfo) {
		var listIndex = cardInfo.listIndex;
		var json = cardInfo.json;
		mainList[listIndex] = json;
		loadMainList();
		console.log('card was added');
	});

	socket.on('cardDeleteReceived', function(cardInfo) {
		var listIndex = cardInfo.listIndex;
		var cardIndex = cardInfo.cardIndex;
		mainList[listIndex].cards.splice(cardIndex, 1);
		loadMainList();
		console.log('card was deleted!');
	})

	socket.on('addListReceived', function(json) {
		mainList.push(json);
		var listLi = createList(mainList.length-1);
		lol.append(listLi);
		console.log('list was added!')
	})

	socket.on('deleteListReceived', function(listIndex) {
		mainList.splice(listIndex, 1);
		loadMainList();
	})

	socket.on('addLabelReceived', function(cardInfo) {
		mainList[cardInfo.listIndex].cards[cardInfo.cardIndex] = cardInfo.card;
		loadMainList();
	})
});

var loadData = function() {
	$.ajax( {
		url: "http://localhost:3000/list/" + bid,
		type: "GET",

		dataType: "json",
	})
	.done(function(json) {
		mainList = json;
		loadMainList();
	});
}

//Loads all the lists from mainList
	//Used in "main"
var loadMainList = function() {
	lol.html('');
	for(var listIndex = 0; listIndex < mainList.length; listIndex++) {
		var listLi = createList(listIndex);
		lol.append(listLi);
	}
	getBoard();
}

//Updates the cards for a specific list [HELPER]
	//used in loadMainList
var updateCardList = function(listIndex, cardsUl) {
	var cardList = mainList[listIndex].cards;
	for(var cardIndex = 0; cardIndex < mainList[listIndex].cards.length; cardIndex++) {
		var card = cardList[cardIndex];
      	var cardLi = $('<li/>').attr('data-cardindex', cardIndex).attr('data-listindex', listIndex);
		var colorArray = card.labels;
		$.each(colorArray, function(i, color) {
				if(color !="") {
				var label = $('<div/>').addClass('labelPreview').css('backgroundColor', color);
				cardLi.append(label);
			}
		});
		var cardTitle = $('<h4>').addClass('cardTitle').html(card.title);
		cardLi.append(cardTitle);
		cardsUl.append(cardLi);
	}
}

//Creates all the HTML elements for one list
	//used in loadMainList, addList
var createList = function(listIndex) {
	var listLi = $('<li/>').addClass('list').attr('data-listindex', listIndex);
	var deleteListButton = $('<div/>').html('&#10006').addClass('deleteList');
	var titleDiv = $('<h4/>').html(mainList[listIndex].title).addClass('listName');
	var cardsUl = $('<ul/>').addClass('cardList');
	updateCardList(listIndex, cardsUl);
	var addCardButton = $('<button/>').html('Add a card...').addClass('addCard');
	var addCardDiv = $('<div/>').addClass('addCardDiv');
	var cardForm = $('<form/>').addClass('cardForm');
	var cardInput = $('<input/>').addClass('cardInput').attr('type','text').attr('autocomplete', 'off').attr('name', 'cardSubmitName');
	var addInput = $('<input/>').attr('type','submit').attr('value','Add').addClass('submitCard');
	var exitInput = $('<div/>').html('&#10006').addClass('closeCardForm');
	cardForm.append(cardInput).append(addInput).append(exitInput);
	addCardDiv.append(cardForm);
	listLi.append(titleDiv).append(deleteListButton).append(cardsUl).append(addCardButton).append(addCardDiv);
	return listLi;
}

//Shows input box after clicking on the 'Add a list...' button
var showInput = function(event) {
	$('#addListSpan').css("display", "none");
	$('#addList').css("display", "inline-block");
	event.stopPropagation();
}

//Submits the input for the add a list form
var submitInput = function() {
	var inputValue = $('#listInput').val();
	if(inputValue != '') {
		$('#listInput').val('');
		addList(inputValue);
		$('#addListSpan').css("display", "inline-block");
		$('#addList').css("display", "none");
	}
}

//Adds a new list to the data structure, and updates UI
var addList = function(listTitle) {
	$.ajax({ 
		url: "http://localhost:3000/list",
		data: {
			'title': listTitle,
			'bid': bid
		},
		type: "POST",
	}).done(function(json) {
		mainList.push(json);
		var listLi = createList(mainList.length-1);
		lol.append(listLi);
		socket.emit('addList', json);
	});
}

//Shows input box after clicking "Add a card" button
var showCardInput = function(event) {
	var parent = $(this).parent();
	var form = $(parent).find('> .addCardDiv');
	var open = $("#outerList").find('.addCardDiv');
	if(open != null) {
		var parent2 = $(open).parent();
		$(parent2).find('> .addCard').css('display', 'block');
		open.css('display', 'none');
	}
	$(this).css("display", "none");
	$(form).css("display", "block");
	event.stopPropagation();
}

//Submits the input for the add a card form
var submitCard = function(event) {
	var parent = $(this).parent();
	var input = $(parent).find('> .cardInput');
	var inputValue = $(input).val();
	if(inputValue != "") {
		$(input).val();
		$(input).val('');
		var cardDiv = $(parent).parent();
		var list = $(cardDiv).parent();
		var listIndex = $(list).attr('data-listindex');
		addCard(inputValue, listIndex);
	}
	return false;
}

var closeCardForm = function(event) {
	$('.cardInput').val('');
	var form = $(this).parent();
	$($(form).parent()).css('display', 'none');
	$('.addCard').css('display', 'block');
}


//Adds a new card to the data structure, updates the UI
var addCard = function(title, listIndex) {
	var newTitle = title;
	var listID = mainList[listIndex]._id;
	$.ajax({
		url: "http://localhost:3000/list/" + listID + "/card",
		data: {
			'title': newTitle,
			'description': '',
			'labels': [], 
			'comments':[]
		},
		type:"POST",
	})
	.done(function(json) {
		mainList[listIndex] = json;
		loadMainList();
		var cardInfo = {
			listIndex: listIndex, 
			json: json
		}
		socket.emit('addCard', cardInfo);
	});
}

//MODAL METHODS
var showModal = function(event) {
	var eventLi = event.currentTarget;
	var listIndex = $(eventLi).attr('data-listindex');
	var cardIndex = $(eventLi).attr('data-cardindex');
	var card = mainList[listIndex].cards[cardIndex];
	$('#cardTitle').html(card.title);
	$('#author').html('Author: ' + card.author);
	if(card.description == "") {
		$('#addDescDiv').css('display', 'block');
	} else {
		$('#desc').html(card.description);
	}
	$('#cardModal').css('display', 'block');
	$('#card').css('display','block');
	$('#card').attr('data-cardindex', cardIndex);
	$('#card').attr('data-listindex', listIndex);
	updateCardLabels(listIndex, cardIndex);
	showComments(listIndex, cardIndex);
}

var hideModal = function(event) {
	$('#commentInput').val('');
	$('#cardModal').css('display', 'none');
	$('#card').css('display', 'none');
	$('#labelDiv').css('display', 'none');
}

//Deletes a list from data structure and updates UI
var deleteList = function(event) {
	var li = $(this).parent();
	var listIndex = li.attr('data-listindex');
	$.ajax({
		url: "http://localhost:3000/list/" + mainList[listIndex]._id,
		type: 'DELETE'
	})
	.done(function() {
		mainList.splice(listIndex, 1);
		loadMainList();
		socket.emit('deleteList', listIndex);
	});
}

//Deletes a card from data structure and updates the UI
var deleteCard = function(event) {
	var card = $(this).parent();
	var listIndex = $(card).attr('data-listindex');
	var cardIndex = $(card).attr('data-cardindex');
	var listID = mainList[listIndex]._id;
	var cardID = mainList[listIndex].cards[cardIndex]._id;
	$.ajax({
		url: "http://localhost:3000/list/" + listID + "/card/" + cardID,
		type: "DELETE"
	})
	.done(function(){
		mainList[listIndex].cards.splice(cardIndex, 1);
		loadMainList();
		hideModal();
		var cardInfo = {
			listIndex: listIndex, 
			cardIndex: cardIndex
		}
		socket.emit('deleteCard', cardInfo);
	})
}

//Applies css background color to labels in the label chooser based on its data attribute color
var labelColors = function() {
	var color = $(this).attr('data-color');
	$(this).css('backgroundColor', color);
}

//Shows the label chooser when clicking on the + button
var showLabels = function() {
	if($('#labelDiv').css('display') === 'none') {
		$('#labelDiv').css('display', 'block'); 
	} 
	else {
		$('#labelDiv').css('display', 'none');
	}
}

//Adds a label to the card, updates the card modal UI and the main UI
var addLabels = function() {
	var color = $(this).attr('data-color');
	var listIndex = $('#card').attr('data-listindex');
	var cardIndex = $('#card').attr('data-cardindex');
	var hasColor = false;
	var card = mainList[listIndex].cards[cardIndex];
	var labelArray = card.labels;
	var hasColor = $.inArray(color, labelArray);
	if(hasColor === -1) {
		var listID = mainList[listIndex]._id;
		var cardID = mainList[listIndex].cards[cardIndex]._id;
		labelArray.push(color);
		var card =  mainList[listIndex].cards[cardIndex]
		$.ajax({
			url: "http://localhost:3000/list/" + listID + "/card/" + cardID,
			data: card,
			type: "PATCH"
		})
		.done(function(){
			$('#labelDiv').css('display', 'none');
			updateCardLabels(listIndex, cardIndex);
			loadMainList();
			var cardInfo = {
				listIndex: listIndex,
				cardIndex: cardIndex,
				card: card
			}
			socket.emit('addLabel', cardInfo);
		});
	}
}

//Updates HTML to include a color label for a card
var updateCardLabels = function(listIndex, cardIndex) {
	$('#labelList').html('');
	var labelArray = mainList[listIndex].cards[cardIndex].labels;
	$.each(labelArray, function(i, color) {
		if(color!="") {
			var label = $('<div/>').addClass('cardLabels').css('backgroundColor', color);
			label.append('+').css('color', color);
			$('#labelList').append(label);
		}
	});
}


var closeListForm = function() {
	$('#listInput').val('');
	$('#addList').css('display', 'none');
	$('#addListSpan').css('display', 'inline-block');
}


var saveComment = function() {
	var text = $('#commentInput').val();
	if(text != '') {
		$('#commentInput').val('');
		var user = $('#user').html();
		var datetime = new Date(); 
		var listIndex = $('#card').attr('data-listindex');
		var cardIndex = $('#card').attr('data-cardindex');
		var card = mainList[listIndex].cards[cardIndex];
		var commentsArray = card.comments;
		var comment = {
			user: user,
			datetime: datetime,
			comment: text
		}
		commentsArray.push(comment);
		var listID = mainList[listIndex]._id;
		var cardID = mainList[listIndex].cards[cardIndex]._id;
		$.ajax({
			url: "http://localhost:3000/list/" + listID + "/card/" + cardID + "/comment", 
			data: comment,
			type: "POST"
		})
		.done(function(){
			showComments(listIndex, cardIndex);
			loadMainList();	
		});
	}
}

var showComments = function(listIndex, cardIndex) {
	$('#commentList').html('');
	var commentArray = mainList[listIndex].cards[cardIndex].comments;
	$.each(commentArray, function(i, comment) {
		var commentLi = $('<li/>');
		var user = $('<div/>').html(comment.user).attr('id', 'userDiv');
		var text = $('<div/>').html(comment.comment).attr('id', 'commentDiv');
		var datetime = $('<div/>').html(comment.datetime).attr('id', 'datetimeDiv');
		commentLi.append(user).append(datetime).append(text);
		$('#commentList').append(commentLi);
	});
}


var getBoard = function() {
	$.ajax({ 
		url: "http://localhost:3000/boards/" + bid,
		type: "GET",
	}).done(function(json) {
		board = json
		$('#boardName').html(board.title);
	});
}

var toggleAddUsers = function() {
	if($('#addUsers').css('display') === 'none') {
		loadCurrentUsers();
		$('#addUsers').css('display', 'inline-block'); 
	} 
	else {
		$('#addUsers').css('display', 'none');
	}
}


var addUser = function() {
	var username = $('#userInput').val();
	if(username != '') {
		$.ajax({
			url: "http://localhost:3000/boards/" + bid + "/user",
			data: {
				username: username
			},
			type: "POST"
		}).done(function(res) {
			if(res == '') {
				//user was not added
				alert('Username does not exist');
			} 
			else if(res == 'in') {
				alert('User is already a member of the board');
			}
			else {
				toggleAddUsers();
			}
		});
	}
}

var loadCurrentUsers = function() {
	var userList = $('#currentUsers');
	userList.html('');
	$.ajax({
		url: "http://localhost:3000/boards/" + bid + "/user",
		type: "GET"
	}).done(function(users) {
		$.each(users, function(i, user) {
			var userLi = $('<li/>').html(user);
			userList.append(userLi);
		});
	})
}



var saveDesc = function() {
	var desc = $('#descInput').val();
	if(desc != '') {
		$('#descInput').val('');
		var user = $('#user').html();
		var listIndex = $('#card').attr('data-listindex');
		var cardIndex = $('#card').attr('data-cardindex');
		var card = mainList[listIndex].cards[cardIndex];
		card.description = desc;
		var listID = mainList[listIndex]._id;
		var cardID = mainList[listIndex].cards[cardIndex]._id;
		$.ajax({
			url: "http://localhost:3000/list/" + listID + "/card/" + cardID, 
			data: card,
			type: "PATCH"
		})
		.done(function(){
			$('#addDescDiv').css('display', 'none');
			$('#desc').html(desc);
		});
	}
}