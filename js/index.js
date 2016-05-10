// Email obfuscator script 2.1 by Tim Williams, University of Arizona. Random encryption key feature by Andrew Moulden, Site Engineering Ltd. This code is freeware provided these four comment lines remain intact. A wizard to generate this code is at http://www.jottings.com/obfuscator/

$(function emailObscurer(){
  coded = "grZr.1BDiwFwDr@QCAwO.1BC"
  key = "ob0EjLADW4RsJpuMlxXhTN7vBIdVm5etc32i9gqKOH6Ganz8kfFYCSrZ1PUwyQ"
  shift = coded.length
  link = ""
  for (i = 0; i < coded.length; i++) {
    if (key.indexOf(coded.charAt(i)) == -1) {
      ltr = coded.charAt(i)
      link += (ltr)
    } else {
      ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length
      link += (key.charAt(ltr))
    }
  }
  $("#email").html("<a target='_blank' href='mailto:" + link + "'>Email</a>")
});

// default game state: computer goes first, uses X
var Xmarker = true;
var playerTurn = false;
var newGameData = {};
var moveCounter = 0;
var playerMoves = [];
var computerMoves = [];

//basic game functions
$(".choosePlayerMarker").click(function(){ 
  if ($(this).val() == "X"){
    Xmarker = true;
  } else {
    Xmarker = false;
  }
})

$(".fillCell").click(function(){
	placeMarker(this);
	updateGameData(this);
})

$("#reset").click(function(){
  $(".fillCell")
    .html("")
    .removeClass("Xmarker")
    .removeClass("Omarker")
		.val("0");
	scrambleSquares();
	initializeGameData();
})

function placeMarker(cell) {
	if (Xmarker === true && $(cell).html() == "") {
    $(cell)
			.toggleClass("Xmarker")
			.html('&#x2716;')
			.attr("value","X")
  } else if (Xmarker === false && $(cell).html() == "") {
    $(cell)
			.toggleClass("Omarker")
			.html('<i class="fa fa-circle-o"></i>')
			.attr("value","O")
  } else {
		alert("Choose a blank square");
		return false;
	}
	Xmarker = !Xmarker;
}

function scrambleSquares() {
	var randomValue = Math.ceil(Math.random()*10) * 3;
	$(".fillCell").each(function(){
		$(this).attr("id",(parseInt($(this).attr("id")) + randomValue) % 9);
	});	
}

function initializeGameData(){
	newGameData = new gameData();
	moveCounter = 0;
	for (var i = 0, j = 3; i < j; i++) {
		var position = positions[i];
		newGameData[position] = [];
		$("." + position).each(function(){
			newGameData[position].push(this.id);
		});
	}
	console.log(newGameData);
	return newGameData;
}

$(document).ready(function(){
	initializeGameData();
});


//game logic
var positions = ["corner","edge","center"];
var magicSquares = {
	board1: {a:[2,7,6],b:[9,5,1],c:[4,3,8]},
	board2: {a:[4,3,8],b:[9,5,1],c:[2,7,6]},
	board3: {a:[6,7,2],b:[1,5,9],c:[8,3,4]},
	board4: {a:[8,3,4],b:[1,5,9],c:[6,7,2]},
	board5: {a:[4,9,2],b:[3,5,7],c:[8,1,6]},
	board6: {a:[8,1,6],b:[3,5,7],c:[4,9,2]},
	board7: {a:[6,1,8],b:[7,5,3],c:[2,9,4]},
	board0: {a:[2,9,4],b:[7,5,3],c:[6,1,8]}
}

function gameData() {
	
	var chooseBoard = "board" + Math.floor(Math.random()*10) % 8;
	$(".boardCell").each(function(element, index){
		var idx = $(this).parent().attr("id");
		for (var i = 0, j = 3; i < j; i++) {
			$(this).attr("value",(magicSquares[chooseBoard][idx][index]));
		}
	});
}

function updateGameData (cell) {
	var row = $(cell).parent().attr("id");
}

// var clonedObject = $.extend(true, {}, existingObject);

/*
First player takes a corner. 
Second player takes an adjacent square.

Okay, so assigning each square a number creates three digit numbers for each winning combination. 

first move()
  if corner.html() = ""
    get the corner spot with the highest Id number
    set it to choosePlayerMarker
  else if center.html() = ""
    set it to choosePlayerMarker
  else if edge.html() = ""
    get the edge spot with the highest Id number
    set it to choosePlayerMarker

every move() after the first
	if I can win on this move
		win
	else if opponent can win
		block
	else if corner.html() = ""
		get the corner spot with the highest Id number
		set it to choosePlayerMarker
	else if center.html() = ""
		get the corner spot with the highest Id number
		set it to choosePlayerMarker
	else if edge.html() = ""
		get the corner spot with the highest Id number
		set it to choosePlayerMarker
  
When game is over, reset button scrambles the Id numbers and starts over.

Need way to track whether it's human turn or computer turn.

Also need a way to track the combinations. Could use multidimentional arrays? Or maybe objects?
*/