var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var List = mongoose.model('List', 
	{
		title: String,
		cards: Array
	}
);

var Card = mongoose.model('Card', 
	{
		title: String,
		description: String,
		labels: Array
	}
);

router.get('/', function(req, res, next) {
	List.find(function(err, lists) {
		res.json(lists);
	});
});


router.post('/', function(req, res) {
	var newList = new List(
		{ title: req.body.title }
	);
	newList.save(function (err, list) {
	  if (err) {
	    console.log(err);
	  } else {
	    res.json(list);
	  }
	});
});

router.delete('/:listID', function(req, res) {
	var listID = req.params.listID;
	List.findOne({_id: listID}, function(err, document) {
		if(err) {
			console.log(err);
		} else {
			document.remove();
			res.send('');
		}
	});
});

router.patch('/:listID', function(req, res) {
	var listID = req.params.listID;
	List.findOne({_id: listID}, function(err, oldList) {
		Object.assign(oldList, req.body);
		oldList.save(function (err, list) {
		if (err) {
		    console.log(err);
		}
			else {
		    res.json(list);
		 }
		});
	});
});

router.post('/:listID/card', function(req, res) {
	var listID = req.params.listID;
	var newCard = new Card({
		title: req.body.title,
		description: req.body.description, 
		labels: req.body.labels
	});
	List.findOne({_id: listID}, function(err, list) {
		list.cards.push(newCard);
		list.save(function(err, list) {
			res.send(list);
		});
	});
});


router.delete('/:listID/card/:cardID', function(req, res) {
	var listID = req.params.listID;
	var cardID = req.params.cardID;
	console.log(cardID);
	List.findOne({_id: listID}, function(err, list) {
		for(var i = 0; i < list.cards.length; i++) {
			if(list.cards[i]._id == cardID) {
				list.cards.splice(i, 1);
				list.save();
				res.send('');
				break;
			}
		}
	});
});

router.patch('/:listID/card/:cardID', function(req, res){
	var listID = req.params.listID;
	var cardID = req.params.cardID;
	List.findOne({_id: listID}, function(err, list) {
		for(var i = 0; i < list.cards.length; i++) {
			if(list.cards[i]._id == cardID) {
				Object.assign(list.cards[i], req.body);
				list.markModified("cards");
				list.save(function(err, list) {
					res.json(list);
				});
				break;
			}
		}
	});
});

module.exports = router;