// var mainList = [
// 	{
// 		title: 'List One', 
// 		cards: [
// 			{title: 'Card1', description: 'Description 1', colors:[]},
// 			{title: 'Card2', description: 'Description 2', colors:[]},
// 			{title: 'Card3', description: 'Description 3', colors:[]},
// 			{title: 'Card4', description: 'Description 4', colors:[]},
// 		]
// 	},
// 	{
// 		title: 'List Two', 
// 		cards: [
// 			{title: 'Card1', description: 'Description 1', colors:[]},
// 			{title: 'Card2', description: 'Description 2', colors:[]},

// 		]
// 	},
// 	{
// 		title: 'List Three', 
// 		cards: [
// 			{title: 'Card1', description: 'Description 1', colors:[]},
// 			{title: 'Card2', description: 'Description 2', colors:[]},
// 			{title: 'Card3', description: 'Description 3', colors:[]},
// 			{title: 'Card4', description: 'Description 4', colors:[]},
// 		]
// 	}
// ]

var lol;
var mainList;
$(function() {
	lol = $('#outerList');
	loadData();

	$('#listForm').submit(function(e) {
		event.preventDefault();
		return false;
	});
	$('.cardForm').submit(function(e) {
		event.preventDefault();

		return false;
	});

	lol.on('click', '.deleteList', deleteList);
	lol.on('click', '.cardList li', showModal);
	lol.on('click', '.addCard', showCardInput);
	lol.on('click', '.submitCard', submitCard);

	$('#addListSpan').click(showInput);
	$('#listSubmit').click(submitInput);
	$('#cardModal').click(hideModal);
	$('#deleteCard').click(deleteCard);
	$('#labelDiv ul li').each(labelColors);
	$('#addLabelsButton').click(showLabels);
	$('#labelDiv ul li').click(addLabels);
});

var loadData = function() {
	$.ajax( {
		url: "http://thiman.me:1337/pilec/list",
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
	cardForm.append(cardInput).append(addInput);
	addCardDiv.append(cardForm);
	listLi.append(titleDiv).append(deleteListButton).append(cardsUl).append(addCardButton).append(addCardDiv);
	return listLi;
}

//Shows input box after clicking on the 'Add a list...' button
var showInput = function() {
	$('#addListSpan').css("display", "none");
	$('#addList').css("display", "inline-block");	
}

//Submits the input for the add a list form
var submitInput = function() {
	var inputValue = $('#listInput').val();
	$('#listInput').val('');
	addList(inputValue);
	$('#addListSpan').css("display", "inline-block");
	$('#addList').css("display", "none");
}

//Adds a new list to the data structure, and updates UI
var addList = function(listTitle) {
	$.ajax({
		url: "http://thiman.me:1337/pilec/list",
		data: {
		'title': listTitle,
		},
		type: "POST",
	}).done(function(json) {
		mainList.push(json);
		var listLi = createList(mainList.length-1);
		lol.append(listLi);
	});
}

//Shows input box after clicking "Add a card" button
var showCardInput = function(event) {
	$(this).css("display", "none");
	var parent = $(this).parent();
	var form = $(parent).find('> .addCardDiv');
	$(form).css("display", "block");
}

//Submits the input for the add a card form
var submitCard = function(event) {
	var parent = $(this).parent();
	var input = $(parent).find('> .cardInput');
	var inputValue = $(input).val();
	$(input).val();
	$(input).val('');
	var cardDiv = $(parent).parent();
	var list = $(cardDiv).parent();
	var listIndex = $(list).attr('data-listindex');
	addCard(inputValue, listIndex);
	return false;
}

//Adds a new card to the data structure, updates the UI
var addCard = function(title, listIndex) {
	var newTitle = title;
	var listID = mainList[listIndex]._id;
	$.ajax({
		url: "http://thiman.me:1337/pilec/list/" + listID + "/card",
		data: {
			'title': newTitle,
			'description': '',
			labels: [''],
		},
		type:"POST",
	})
	.done(function(json) {
		alert('added!');
		mainList[listIndex] = json;
		loadMainList();
	});
}

//MODAL METHODS
var showModal = function(event) {
	var eventLi = event.currentTarget;
	var listIndex = $(eventLi).attr('data-listindex');
	var cardIndex = $(eventLi).attr('data-cardindex');
	var card = mainList[listIndex].cards[cardIndex];
	$('#cardTitle').html(card.title);
	$('#desc').html(card.description);
	$('#cardModal').css('display', 'block');
	$('#card').css('display','block');
	$('#card').attr('data-cardindex', cardIndex);
	$('#card').attr('data-listindex', listIndex);
	updateCardLabels(listIndex, cardIndex);
}

var hideModal = function(event) {
	$('#cardModal').css('display', 'none');
	$('#card').css('display', 'none');
	$('#labelDiv').css('display', 'none');
}

//Deletes a list from data structure and updates UI
var deleteList = function(event) {
	var li = $(this).parent();
	var listIndex = li.attr('data-listindex');
	$.ajax({
		url: "http://thiman.me:1337/pilec/list/" + mainList[listIndex]._id,
		type: 'DELETE'
	})
	.done(function() {
		alert('deleted!');
		mainList.splice(listIndex, 1);
		loadMainList();

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
		url: "http://thiman.me:1337/pilec/list/" + listID + "/card/" + cardID,
		type: "DELETE"
	})
	.done(function(){
		alert('deleted!');
		mainList[listIndex].cards.splice(cardIndex, 1);
		loadMainList();
		hideModal();
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
}

//Adds a label to the card, updates the card modal UI and the main UI
var addLabels = function() {
	var color = $(this).attr('data-color');
	var listIndex = $('#card').attr('data-listindex');
	var cardIndex = $('#card').attr('data-cardindex');
	var hasColor = false;
	var labelArray = mainList[listIndex].cards[cardIndex].labels;
	var hasColor = $.inArray(color, labelArray);
	if(hasColor === -1) {
		var listID = mainList[listIndex]._id;
		var cardID = mainList[listIndex].cards[cardIndex]._id;
		labelArray.push(color);
		var card =  mainList[listIndex].cards[cardIndex]


		$.ajax({
			url: "http://thiman.me:1337/pilec/list/" + listID + "/card/" + cardID,
			data: card,
			// {
			// 	"title": card.title,
			// 	"description": card.description,
			// 	"labels": card.labels,
			// 	"_id": card._id,
			// },
			type: "PATCH"
		})
		.done(function(){
			alert('added label!');
			$('#labelDiv').css('display', 'none');
			updateCardLabels(listIndex, cardIndex);
			loadMainList();	
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