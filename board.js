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
var card1 = new Card('CardTitle1', ['Chris'], ['blue'], 'This is my description', ['one comment']);
var card2 = new Card('CardTitle2', ['Chris'], ['blue'], 'This is my description', ['one comment']);
var card3 = new Card('CardTitle3', ['Chris'], ['blue'], 'This is my description', ['one comment']);
var card4 = new Card('CardTitle4', ['Chris'], ['blue'], 'This is my description', ['one comment']);
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

		// li.setAttribute("data-listindex", i.toString());

		//add list title
		var title = document.createElement("div");
		title.setAttribute("class", "listname");
		console.log(array[i]);
		title.innerHTML = array[i].title;
		li.appendChild(title);

		//add cards [still need to clean up card]
		var ul = document.createElement("ul");
		ul.setAttribute("class", "cardlist");
		for(var y = 0; y < array[i].cards.length; y++) {
			var liCard = document.createElement("li");
			liCard.dataset.title = array[i].cards[y].title;
			liCard.innerHTML = array[i].cards[y].title;
			liCard.setAttribute("class", "cardpreview");
			liCard.onclick = showModal;
			ul.appendChild(liCard);
		}
		li.appendChild(ul);

		//add addButton
		var addcard = document.createElement("div");
		addcard.setAttribute("class","addcard");
		addcard.innerHTML = "Add a card...";
		addcard.onclick = addCardFunc;
		addcard.dataset.listindex = i;
		li.appendChild(addcard);

		//add to mainlist
		var addList = document.getElementById("addlist");
		mainlist.insertBefore(li, addList);
	}
}


// modal 
var modal = document.getElementById("mymodal")
function showModal() {
	modal.style.display = "block";
}

window.onclick = function(event) {
	if(event.target == modal) {
		modal.style.display = "none";
	}
}


//add card function
// var lists = document.getElementsByClassName("cardlist");
function addCardFunc(e) {
	modal.style.display = "block";
	var li = document.createElement("li");
	li.setAttribute("class", "cardpreview");
	li.appendChild(document.createTextNode("Card"));
	li.onclick = showModal;

	var index = e.target.dataset.listindex;
	var newCard = new Card('NewCard');
	listoflists[index].cards.push(newCard);

	var list = document.getElementById("list" + index.toString());
	list.insertBefore(li, list.lastChild);
}



// var addcardbutton = document.getElementsByClassName("addcard");
// for(var i = 0, len = addcardbutton.length; i<len; i++) {
// 	addcardbutton[i].onclick = addCardFunc;
// }


//add list
var addlistbutton = document.getElementById("addlist");
addlistbutton.onclick = function(e) {
	var li = document.createElement('li');
	var index = e.target.dataset.listindex;
	li.setAttribute("class", "list");
	li.setAttribute("id", "list" + index.toString());
	// li.dataset.listindex = index;

	//set the name
	var listname = document.createElement("div");
	listname.setAttribute("class", "listname");
	listname.innerHTML = "ListName";
	li.appendChild(listname);

	//create addbutton
	var addcard = document.createElement("div");
	addcard.setAttribute("class","addcard");
	addcard.innerHTML = "Add a card...";
	addcard.onclick = addCardFunc;
	addcard.dataset.listindex = index;
	li.appendChild(addcard);


	var mainlist = document.getElementById("mainlist");
	var addList = document.getElementById("addlist");
	var list = new List('NewList');
	listoflists.push(list);
	addList.dataset.listindex++;
	mainlist.insertBefore(li, addList);
}



//delete card
var deletecard = document.getElementById("deleteCard");
deletecard.onclick = function(event) {
	modal.style.display = "none";
	//NEED TO DO
}