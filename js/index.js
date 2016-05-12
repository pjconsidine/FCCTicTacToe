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
let isXturn = true;
let ishumanTurn = false;
const gameData = {
	center: [4],
	corner: [0,2,6,8],
	edge: [1,3,5,7],
	Xmoves: [],
	Omoves: [],
	freeSquares: {
		a: [0,1,2],
		b: [3,4,5],
		c: [6,7,8]
	}
}
function setupBoard(){
	let chooseBoard = "board" + Math.floor(Math.random()*10) % 8;
	const boardLayouts = {
		board1: {a:[2,7,6],b:[9,5,1],c:[4,3,8]},
		board2: {a:[4,3,8],b:[9,5,1],c:[2,7,6]},
		board3: {a:[6,7,2],b:[1,5,9],c:[8,3,4]},
		board4: {a:[8,3,4],b:[1,5,9],c:[6,7,2]},
		board5: {a:[4,9,2],b:[3,5,7],c:[8,1,6]},
		board6: {a:[8,1,6],b:[3,5,7],c:[4,9,2]},
		board7: {a:[6,1,8],b:[7,5,3],c:[2,9,4]},
		board0: {a:[2,9,4],b:[7,5,3],c:[6,1,8]}
	}
	$(".boardCell").each(function(index){
		let row = $(this).parent().attr("id");
		$(this).attr("value",(boardLayouts[chooseBoard][row][index % 3]));
	});
	return $(".gameArea");
}

//basic game functions
function placeMarker(cell) {
	if (isXturn === true && $(cell).html() == "") {
		$(cell)
			.toggleClass("Xmarker")
			.html('&#x2716;');
	} else if (isXturn === false && $(cell).html() == "") {
		$(cell)
			.toggleClass("Omarker")
			.html('<i class="fa fa-circle-o"></i>')
	} else {
		alert("Choose a blank square");
		return false;
	}
	isXturn = !isXturn;	
}
	
$(".humanChooseMarker").click(function(){ 
  if ($(this).val() == "X"){
    isXturn = true;
  } else {
    isXturn = false;
  }
})

$(".fillCell").click(function(){
	placeMarker(this);
})

$("#reset").click(function(){
  $(".boardCell")
    .html("")
    .removeClass("Xmarker")
    .removeClass("Omarker")
	setupBoard();
})

$(document).ready(function(){
	setupBoard();
});



/* game logic

function playGame() {
	
	
}

First human takes a corner. 
Second human takes an adjacent square.

first move()
  if corner.html() = ""
    get the corner spot with the highest Id number
    set it to humanChooseMarker
  else if center.html() = ""
    set it to humanChooseMarker
  else if edge.html() = ""
    get the edge spot with the highest Id number
    set it to humanChooseMarker

every move() after the first
	if I can win on this move
		win
	else if opponent can win
		block
	else if corner.html() = ""
		get the corner spot with the highest Id number
		set it to humanChooseMarker
	else if center.html() = ""
		get the corner spot with the highest Id number
		set it to humanChooseMarker
	else if edge.html() = ""
		get the corner spot with the highest Id number
		set it to humanChooseMarker
  
When game is over, reset button scrambles the Id numbers and starts over.

Need way to track whether it's human turn or computer turn.

Also need a way to track the combinations. Could use multidimentional arrays? Or maybe objects?

OLD CODE BITS
function to reset the Ids of the board squares
function scrambleSquares() {
	var randomValue = Math.ceil(Math.random()*10) * 3;
	$(".fillCell").each(function(){
		$(this).attr("id",(parseInt($(this).attr("id")) + randomValue) % 9);
	});	
}
*/