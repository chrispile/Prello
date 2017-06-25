var mainList = [
	{
		title: 'List One', 
		cards: [
			{title: 'Card1', description: 'Description 1'},
			{title: 'Card2', description: 'Description 2'},
			{title: 'Card3', description: 'Description 3'},
			{title: 'Card4', description: 'Description 4'},
		]
	},
	{
		title: 'List Two', 
		cards: [
			{title: 'Card1', description: 'Description 1'},
			{title: 'Card2', description: 'Description 2'},

		]
	},
	{
		title: 'List Three', 
		cards: [
			{title: 'Card1', description: 'Description 1'},
			{title: 'Card2', description: 'Description 2'},
			{title: 'Card3', description: 'Description 3'},
			{title: 'Card4', description: 'Description 4'},
		]
	}
]

var lol;
$(function() {
	lol = $('#outerList');
	loadMainList();
	$('#addListSpan').click(showInput);
	$('#listSubmit').click(submitInput);
	$('#listForm').submit(function(e) {
		event.preventDefault();
	});
	$('.cardForm').submit(function(e) {
		event.preventDefault();
	});
	lol.on('click', '.deleteList', deleteList);
	lol.on('click', '.cardList li', showModal);
	lol.on('click', '.addCard', showCardInput);
	lol.on('click', '.submitCard', submitCard);
	$('#cardModal').click(hideModal);
	$('#deleteCard').click(deleteCard);
});

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
		var cardTitle = $('<h4>').html(card.title);
		cardLi.append(cardTitle);
		cardsUl.append(cardLi);
	}
}

var createList = function(listIndex) {
	var listLi = $('<li/>').addClass('list').attr('data-listindex', listIndex);
	var deleteListButton = $('<div/>').html('&#10006').addClass('deleteList');
	var titleDiv = $('<h4/>').html(mainList[listIndex].title).addClass('listName');
	var cardsUl = $('<ul/>').addClass('cardList');
	updateCardList(listIndex, cardsUl);
	var addCardButton = $('<button/>').html('Add a card...').addClass('addCard');
	var addCardDiv = $('<div/>').addClass('addCardDiv');
	var cardForm = $('<form/>').addClass('cardForm');
	var cardInput = $('<input/>').addClass('cardInput').attr('type','text').attr('autocomplete', 'off');
	var addInput = $('<input/>').attr('type','submit').attr('value','Add').addClass('submitCard');
	cardForm.append(cardInput).append(addInput);
	addCardDiv.append(cardForm);
	listLi.append(titleDiv).append(deleteListButton).append(cardsUl).append(addCardButton).append(addCardDiv);
	return listLi;
}

//addListHelpers
var showInput = function() {
	$('#addListSpan').css("display", "none");
	$('#addList').css("display", "inline-block");	
}

var submitInput = function() {
	var inputValue = $('#listInput').val();
	$('#listInput').val('');
	addList(inputValue);
	$('#addListSpan').css("display", "inline-block");
	$('#addList').css("display", "none");
}

var addList = function(listTitle) {
	mainList.push({
		'title': listTitle,
		cards: []
	});
	var listLi = createList(mainList.length-1);
	lol.append(listLi);
}

//addCardHelpers
var showCardInput = function(event) {
	$(this).css("display", "none");
	var parent = $(this).parent();
	var form = $(parent).find('> .addCardDiv');
	$(form).css("display", "block");
}

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
}


var addCard = function(title, listIndex) {
	mainList[listIndex].cards.push({
		'title': title,
		description: ''
	})
	loadMainList();
}

var deleteList = function(event) {
	var li = $(this).parent();
	var listIndex = li.attr('data-listindex');
	console.log(mainList);
	mainList.splice(listIndex, 1);
	console.log(mainList);
	loadMainList();
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
	$('#card').attr('data-cardindex', cardIndex);
	$('#card').attr('data-listindex', listIndex);
}

var hideModal = function(event) {
	$('#cardModal').css('display', 'none');
}

var deleteCard = function(event) {
	var card = $(this).parent();
	var listIndex = $(card).attr('data-listindex');
	var cardIndex = $(card).attr('data-cardindex');
	mainList[listIndex].cards.splice(cardIndex, 1);
	var selector = '.list[data-listindex=' + listIndex + '] .cardList';
	var cardList = $(selector);
	cardList.html('');
	updateCardList(listIndex, cardList);
}

