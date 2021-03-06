"use strict";
/* Email obfuscator script 2.1 by Tim Williams
University of Arizona. Random encryption key feature by Andrew Moulden, Site Engineering Ltd. This code is freeware provided these four comment lines remain intact. A wizard to generate this code is at http://www.jottings.com/obfuscator/
*/
$(function emailObscurer(){
  const coded = "grZr.1BDiwFwDr@QCAwO.1BC"
  const key = "ob0EjLADW4RsJpuMlxXhTN7vBIdVm5etc32i9gqKOH6Ganz8kfFYCSrZ1PUwyQ"
  let shift = coded.length
  let link = ""
  for (let i = 0; i < coded.length; i++) {
    if (key.indexOf(coded.charAt(i)) == -1) {
      let ltr = coded.charAt(i)
      link += (ltr)
    } else {
      let ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length
      link += (key.charAt(ltr))
    }
  }
  $("#email").html("<a href='mailto:" + link + "'>Email</a>")
});
// default game state: computer goes first, uses X
let isHumanTurn = false;
let human = "O";
let comp = "X";
let gameOver = false;
let humanWon = false;
let newGameData;
const gameData = {
	state:				{},
	centerId: 		[5],
	cornerIds: 		[1,3,7,9],
	edgeIds: 			[2,4,6,8],
	totalMoves: 	 0
}

//basic game functions
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
	newGameData = {};
	newGameData = $.extend({},gameData, true);
	return $(".gameArea"), newGameData;
}
function placeMarker(cell,marker) {
	newGameData.totalMoves = Number(newGameData.totalMoves) + 1;
	const updateGameData = function(marker) {
		const rows = ['a','b','c'];
		const cols = ['A','B','C'];
		const diags = ['D1','D2'];
		const matchMarker = "." + marker + "marker";
		$(rows).each(function(index, element) {
			let rowId = "#" + rows[index];
			$(rowId).children(matchMarker).each(function(index,element){
				const dataKeyName = rows[index] + marker;
				if (!newGameData.state[dataKeyName]) {
					newGameData.state[dataKeyName] = [$(this).attr("value")];
				} else if ($.inArray($(this).attr("value"), newGameData.state[dataKeyName]) == -1) {
					newGameData.state[dataKeyName].push($(this).attr("value"));
				} else {
					return;
				}
			});
		});
		$(cols).each(function(index, element) {
			let colId = "." + cols[index];
			$(colId + matchMarker).each(function(index,element){
				const dataKeyName = cols[index] + marker;
				if (!newGameData.state[dataKeyName]) {
					newGameData.state[dataKeyName] = [$(this).attr("value")];
				} else if ($.inArray($(this).attr("value"), newGameData.state[dataKeyName]) == -1) {
					newGameData.state[dataKeyName].push($(this).attr("value"));
				} else {
					return;
				}
			})
		});
		$(diags).each(function(index, element) {
			let dId = "." + diags[index];
			$(dId + matchMarker).each(function(index,element){
				const dataKeyName = diags[index] + marker;
				if (!newGameData.state[dataKeyName]) {
					newGameData.state[dataKeyName] = [$(this).attr("value")];
				} else if ($.inArray($(this).attr("value"), newGameData.state[dataKeyName]) == -1) {
					newGameData.state[dataKeyName].push($(this).attr("value"));
				} else {
					return;
				}
			})
		});
		if (newGameData.totalMoves === 9) {
			gameOver = true;
		}
		return newGameData;
	}
	if (marker == "X" && $(cell).html() == "") {
		$(cell)
			.toggleClass("Xmarker")
			.html('&#x2716;');
		updateGameData("X");
	} else if (marker == "O" && $(cell).html() == "") {
		$(cell)
			.toggleClass("Omarker")
			.html('<i class="fa fa-circle-o"></i>')
		updateGameData("O");
	} else if (gameOver === true) {
		alert("Game is a draw\nTry again");
		return false;
	} else {
		alert("Choose a blank square");
		return false;
	}
	isHumanTurn = !isHumanTurn;
}

$(".fillCell").click(function(){
	placeMarker(this, human);
})
$("#reset").click(function(){
  $(".boardCell")
    .html("")
    .removeClass("Xmarker")
    .removeClass("Omarker")
	setupBoard();
	isHumanTurn = false;
	let newGameData = $.extend({},gameData, true);
	return newGameData;
})
$("#start").click(function(){
	playGame();
});

// game logic
function playGame() {
	let compMoves = new RegExp ("X", "gi");
	let humanMoves = new RegExp ("O", "gi");

	function winOrBlock(player) {
		// finds two in a row and either wins or blocks
		for (let key of Object.keys(newGameData.state)) {
			let x = newGameData.state[key].reduce((a,b) => +a + +b);
			if(key.match(player)){
				console.log(newGameData.state);
				if (newGameData.state[key].length > 1) {
					if ($(".boardCell[value=" + (15-x) + "]").html() == "") {
						placeMarker($(".boardCell[value=" + (15-x) + "]"),"X");
						return true;
					}
				}
			}
		}
		return false;
	}
		
	if (newGameData.totalMoves === 0) { 					// computer goes first
		placeMarker($(".boardCell[value=8]"),"X");
	} else if (newGameData.totalMoves === 1) { 		// human goes first
		if ($(".center").hasClass("Omarker")) {
			placeMarker($(".corner[value=8]"),"X");
		} else {
			placeMarker($(".center"),"X");
		}
	}	else if (newGameData.totalMoves === 2) {		// computer's second move
		if ($(".center").hasClass('Omarker')) {
			placeMarker($(".corner[value=2]"), 'X');
		} else {
			placeMarker($(".corner[value=4]"), "X");
		}
	} else if (newGameData.totalMoves === 3) {
		if (winOrBlock(human) === false) {
			placeMarker($(".boardCell[value=3]"), "X");
		}
	} else if (newGameData.totalMoves > 3) {
		if (winOrBlock(comp) == false) {
			winOrBlock(human);
		}
	}
}
		/* routine for computer going first
		computer chooses a corner
				human chooses center
					computer chooses corner that sums to 15
					human chooses corner
						computer blocks and sets up fork
					human chooses edge
						computer blocks
						game is a draw
				human chooses other than center
					computer chooses corner with the value that doesn't sum to 10;
					human blocks
					computer chooses third corner and sets up a fork
		*/	

		/* routine for person going first
		human chooses edge
				computer chooses center
				human chooses edge that sums to 15
					computer chooses a corner
				If your opponent puts the second O on the opposite edge, making a row or column that reads O-X-O, put your second X in a corner. Then, if your opponent puts the third O in the edge that is adjacent to your X, making a line that reads O-X-O, put your third X in the empty square to block their row of two O's. From here, you can always win with your fourth X
				computer blocks
			
		human chooses center
				computer chooses corner
				human chooses corner
					computer chooses corner or blocks
					game is a draw
				human chooses edge
					computer blocks
					game is a draw
			
		/* human chooses corner
				computer chooses center
				human chooses corner
				computer chooses edge or blocks
				game is a draw
			
	return newGameData;
} */


// code testing section

	
	
$(document).ready(function(){
	setupBoard();
});

/* OLD CODE BITS
function to reset the Ids of the board squares
function scrambleSquares() {
	var randomValue = Math.ceil(Math.random()*10) * 3;
	$(".fillCell").each(function(){
		$(this).attr("id",(parseInt($(this).attr("id")) + randomValue) % 9);
	});
}

$(".humanChooseMarker").click(function(){
  if ($(this).val() == "X"){
    human = "X";
		comp = "O";
  } else if ($(this).val() == "O") {
    human = "O";
		comp = "X";
  }
})
*/