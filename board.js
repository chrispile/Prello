function List(title, cards){
	this.title = title|| '';
	this.cards = cards|| [];
}

function Card(title,members,labels,description,comments){
	this.title = title||'';
	this.members = members||[];
	this.labels = labels||[];
	this.description = description||'';
	this.comments = comments||[];
}

//CARDS
var card1 = new Card('CardTitle1', ['Chris', 'User', 'User'], ['blue'], 'This is my description', ['one comment', 'two comment', 'three comment']);
var card2 = new Card('CardTitle2', ['Chris', 'User'], ['blue'], 'This is my description', ['one comment', 'two comment']);
var card3 = new Card('CardTitle3', ['Chris'], ['blue', 'red', 'green'], 'This is my description', ['one comment']);
var card4 = new Card('CardTitle4', ['Chris'], ['blue', 'red'], 'This is my description', ['one comment']);
var card5 = new Card('CardTitle5', ['Chris'], ['blue'], 'This is my description', ['one comment']);

//LISTS
var list1 = new List('List1', [card1, card2, card3, card4, card5]);
var list2 = new List('List2', [card1, card3]);

//MAINLIST
var listoflists = [list1, list2];
loadLists(listoflists);


//LOAD PAGE WITH DUMMY LISTS W/CARDS
function loadLists(array) {
	var mainlist = document.getElementById("mainlist");
	for(var i = 0; i < array.length; i++) {
		var li = document.createElement("li");
		li.setAttribute("class", "list");
		li.setAttribute("id", "list" + i.toString());

		// create deletebutton
		var deleteList = deleteListButton(i);
		li.appendChild(deleteList);

		//add list title
		var title = listTitle(array[i].title);
		li.appendChild(title);

		//add cards [still need to clean up card]
		var ul = document.createElement("ul");
		ul.setAttribute("class", "cardlist");
		ul.setAttribute("id", "cardlist" + i.toString());
		for(var y = 0; y < array[i].cards.length; y++) {
			var liCard = createCard(i, y, array[i].cards[y].title);
			ul.appendChild(liCard);
		}
		li.appendChild(ul);

		//add addButton
		var addcard = addCardButton(i);
		li.appendChild(addcard);

		//add to mainlist
		var addList = document.getElementById("addlist");
		addList.dataset.listindex++;
		mainlist.insertBefore(li, addList);
	}
}


//modal 
var modal = document.getElementById("mymodal")
function showModal(e) {
	var listIndex = e.target.dataset.listindex;
	var cardIndex = e.target.dataset.cardindex;
	var jscard = listoflists[listIndex].cards[cardIndex];

	var labelsButton = document.getElementById("addLabels");
	labelsButton.dataset.listindex = listIndex;
	labelsButton.dataset.cardindex = cardIndex;

	//update deletebutton data
	var deleteButton = document.getElementById("deleteCard");
	deleteButton.dataset.listindex = listIndex;
	deleteButton.dataset.cardindex = cardIndex;

	//set title
	var titleElem = document.getElementById('cardtitle');
	titleElem.innerHTML = jscard.title;

	//set members
	var memberslist = document.getElementById("memberslist");
	while(memberslist.firstChild) {
		memberslist.removeChild(memberslist.firstChild);
	}
	for(var i = 0; i < jscard.members.length; i++) {
		var member = document.createElement("li");
		member.setAttribute("class", "member");
		memberslist.appendChild(member);
	}

	//set labels
	var labelslist = document.getElementById("labels");
	while(labelslist.firstChild) {
		labelslist.removeChild(labels.firstChild);
	}
	for(var i = 0; i<jscard.labels.length; i++) {
		var label = document.createElement("li");
		label.style.backgroundColor = jscard.labels[i];
		label.dataset.color = jscard.labels[i];
		labelslist.appendChild(label);
	}

	//set description
	var descElem = document.getElementById('carddesc');
	descElem.innerHTML = jscard.description;

	//set comments
	var commentslist = document.getElementById("comments");
	while(commentslist.firstChild) {
		commentslist.removeChild(commentslist.firstChild);
	}
	for(var i = 0; i < jscard.comments.length; i++) {
		var comment = document.createElement("li");
		comment.setAttribute("class", "comment");
		comment.innerHTML = jscard.comments[i];
		commentslist.appendChild(comment);
	}


	modal.style.display = "block";
}

window.onclick = function(event) {
	if(event.target == modal) {
		modal.style.display = "none";
	}
}


//add defaultcard function
function addCardFunc(e) {
	var listIndex = e.target.dataset.listindex;
	var cardindex = listoflists[listIndex].cards.length;
	var li = createCard(listIndex, cardindex, 'NewCard')
	var cardlist = document.getElementById("cardlist" + listIndex.toString()); //FIX THIS
	cardlist.appendChild(li); //FIX THIS
	//set title
	var titleElem = document.getElementById('cardtitle');
	titleElem.innerHTML = 'NewCard';
	//set description
	var descElem = document.getElementById('carddesc');
	descElem.innerHTML = 'Default description';
	//empty members
	var memberslist = document.getElementById("memberslist");
	while(memberslist.firstChild) {
		memberslist.removeChild(memberslist.firstChild);
	}
	//empty labels
	var labelslist = document.getElementById("labels");
	while(labelslist.firstChild) {
		labelslist.removeChild(labels.firstChild);
	}
	//empty comments
	var commentslist = document.getElementById("comments");
	while(commentslist.firstChild) {
		commentslist.removeChild(commentslist.firstChild);
	}

	//store new card in js array
	var newCard = new Card('NewCard', [], [], "Default description", []);
	listoflists[listIndex].cards.push(newCard);


	var deleteButton = document.getElementById("deleteCard");
	deleteButton.dataset.listindex = listIndex;
	deleteButton.dataset.cardindex = cardindex;

	var labelsButton = document.getElementById("addLabels");
	labelsButton.dataset.listindex = listIndex;
	labelsButton.dataset.cardindex = cardindex;

	modal.style.display = "block";

}


function deleteListFunc(event) {
	var index = event.target.dataset.listindex;
	var toDelete = document.getElementById("list" + index);
	var parent = document.getElementById("mainlist");
	parent.removeChild(toDelete);

	var addlistbutton = document.getElementById("addlist");
	var lastindex = addlistbutton.dataset.listindex;
	for(var i = parseInt(index) + 1; i < lastindex; i++) {
		var list = document.getElementById("list" + i.toString());
		list.setAttribute("id", "list" + (i-1).toString());
		var deletebutton = list.firstElementChild;
		deletebutton.dataset.listindex = i - 1;
		var cardlist = document.getElementById("cardlist" + i.toString());
		cardlist.setAttribute("id", "cardlist" + (i-1).toString());

	}
	listoflists.splice(index, 1);
	addlistbutton.dataset.listindex = i - 1;
}

//add list
var addlistbutton = document.getElementById("addlist");
addlistbutton.onclick = function(e) {
	var li = document.createElement('li');
	var index = e.target.dataset.listindex;
	li.setAttribute("class", "list");
	li.setAttribute("id", "list" + index.toString());

	//create deletebutton
	var deletebutton = deleteListButton(index);
	li.appendChild(deletebutton);

	//set the name
	var listname = listTitle('ListName');
	li.appendChild(listname);

	//add cardlist
	var cardlist = document.createElement("ul");
	cardlist.setAttribute("class", "cardlist");
	cardlist.setAttribute("id", "cardlist"+index);
	li.appendChild(cardlist);

	//create addbutton
	var addcard = addCardButton(index);
	li.appendChild(addcard);

	var mainlist = document.getElementById("mainlist");
	var addList = document.getElementById("addlist");
	var list = new List('NewList');
	listoflists.push(list);
	addList.dataset.listindex++;
	mainlist.insertBefore(li, addList);
}


//function delete list button
function deleteListButton(index) {
	var deleteList = document.createElement("div");
	deleteList.setAttribute("class", "deleteList");
	deleteList.innerHTML = "&#10006";
	deleteList.dataset.listindex = index;
	deleteList.onclick = deleteListFunc;
	return deleteList;
}

function addCardButton(index) {
	var addcard = document.createElement("div");
	addcard.setAttribute("class","addcard");
	addcard.innerHTML = "Add a card...";
	addcard.onclick = addCardFunc;
	addcard.dataset.listindex = index;
	return addcard;
}

function listTitle(titlename) {
	var title = document.createElement("div");
	title.setAttribute("class", "listname");
	title.innerHTML = titlename;
	return title;
}

//create card element for HTML
function createCard(listIndex, cardIndex, title) {
	var li = document.createElement("li");
	li.setAttribute("class", "cardpreview");
	li.appendChild(document.createTextNode("Card"));
	li.onclick = showModal;
	li.dataset.listindex = listIndex;
	li.dataset.cardindex = cardIndex;
	li.dataset.title = title;
	li.innerHTML = title;
	return li;
}




//delete card
var deletecard = document.getElementById("deleteCard");
deletecard.onclick = function(event) {
	var listindex = event.target.dataset.listindex;
	var cardindex = event.target.dataset.cardindex;
	var cardlist = document.getElementById("cardlist" + listindex);
	var string = "[data-cardindex='" + cardindex + "']";
	var toDelete = cardlist.querySelector(string);
	for(var i = parseInt(cardindex)+1; i < cardlist.childNodes.length; i++) {
		var string = "[data-cardindex='" + i + "']";
		var cardupdate = cardlist.querySelector(string);
		cardupdate.dataset.cardindex = i - 1;
	}
	cardlist.removeChild(toDelete);
	listoflists[listindex].cards.splice(cardindex, 1);
	modal.style.display = "none";
}


//add label
function addLabel(e) {
	var labelslist = document.getElementById("labels");
	var label = document.createElement("li");
	var color = e.target.dataset.color
	label.style.backgroundColor = color;
	var addlabel = document.getElementById("addLabels");

	var listIndex = addlabel.dataset.listindex;
	var cardIndex = addlabel.dataset.cardindex;

	var childlabels = listoflists[listIndex].cards[cardIndex].labels;
	for(var i = 0; i < childlabels.length; i++) {
		if(color == childlabels[i]) {
			return;
		}
	}
	labelslist.appendChild(label);
	childlabels.push(color);

	var labelchooser = document.getElementById("labelchooser");
	labelchooser.style.display = "none";
}

var deflabels = document.querySelectorAll(".deflabel");
for(var i = 0; i < deflabels.length; i++) {
	deflabels[i].onclick = addLabel;
	deflabels[i].style.backgroundColor = deflabels[i].dataset.color;
}


var labelbutton = document.getElementById("addLabels") 
labelbutton.onclick = function() {
	var labelchooser = document.getElementById("labelchooser");
	labelchooser.style.display = "inline-flex"
}