/*
 * Email obfuscator script 2.1 by Tim Williams
 *  University of Arizona. Random encryption key feature by Andrew Moulden, Site Engineering Ltd.
 *  This code is freeware provided these four comment lines remain intact.
 *  A wizard to generate this code is at http://www.jottings.com/obfuscator/
 */
$(function emailObscurer() {
    var coded = "grZr.1BDiwFwDr@QCAwO.1BC";
    var key = "ob0EjLADW4RsJpuMlxXhTN7vBIdVm5etc32i9gqKOH6Ganz8kfFYCSrZ1PUwyQ";
    var shift = coded.length;
    var link = "";
    for (var i = 0; i < coded.length; i++) {
        if (key.indexOf(coded.charAt(i)) === -1) {
            var ltr = coded.charAt(i);
            link += (ltr);
        } else {
            var ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length;
            link += (key.charAt(ltr));
        }
    }
    $("#email").html("<a href='mailto:" + link + "'>Email</a>");
});

// default game state: computer goes first, uses X
var isHumanTurn = true;
var human = "O";
var comp = "X";
var gameOver = false;
var humanWon = false;

function gameData() {
    this.board = ['a', 'b', 'c', 'A', 'B', 'C', 'd', 'D'];    // rows, columns, diagonals
    this.moves = {};
    this.X = {};
    this.O = {};
    this.last = {};
    this.totalMoves = 0;
}

//basic game functions
function setupBoard() {
    var chooseBoard = "board" + Math.floor(Math.random() * 10) % 8;
    var boardLayouts = {
        board1: {a: [2, 7, 6], b: [9, 5, 1], c: [4, 3, 8]},
        board2: {a: [4, 3, 8], b: [9, 5, 1], c: [2, 7, 6]},
        board3: {a: [6, 7, 2], b: [1, 5, 9], c: [8, 3, 4]},
        board4: {a: [8, 3, 4], b: [1, 5, 9], c: [6, 7, 2]},
        board5: {a: [4, 9, 2], b: [3, 5, 7], c: [8, 1, 6]},
        board6: {a: [8, 1, 6], b: [3, 5, 7], c: [4, 9, 2]},
        board7: {a: [6, 1, 8], b: [7, 5, 3], c: [2, 9, 4]},
        board0: {a: [2, 9, 4], b: [7, 5, 3], c: [6, 1, 8]}
    };
    $(".boardCell").each(function (index) {
        var row = $(this).parent().attr("id");
        $(this).attr("value", (boardLayouts[chooseBoard][row][index % 3]));
    });
    newGameData = new gameData();
    return $(".gameArea"), newGameData;
}

function  updateGameData(cell, marker) {
    var cellValue = $(cell).attr('value');
    newGameData.last[marker] = +cellValue;
    $(newGameData.board).each(function (index, element) {
        if ($(cell).hasClass(element)) {
            if (newGameData[marker][element]) {
                if (newGameData[marker][element].indexOf(cellValue) === -1) {
                    newGameData[marker][element].push(Number(cellValue));
                }
            } else {
                newGameData[marker][element] = [Number(cellValue)];
            }
        }
    });
    newGameData.totalMoves = Number(newGameData.totalMoves) + 1;
}

function placeMarker(cell, marker) {
    if ($(cell).html() !== "") {
        return false;
    } else if (marker === "X" && $(cell).html() === "") {
        $(cell)
                .toggleClass("Xmarker")
                .html("&#x2716;");
        updateGameData(cell, "X");
        isHumanTurn = !isHumanTurn;
        return true;
    } else if (marker === "O" && $(cell).html() === "") {
        $(cell)
                .toggleClass("Omarker")
                .html('<i class="fa fa-circle-o"></i>');
        updateGameData(cell, "O");
        isHumanTurn = !isHumanTurn;
        return true;
    } else {
        console.log("No choice found");
        return false;
    }
}

/*
 * code for an optional feature for player to choose X or O.
 * requires HTML for selector buttons to be uncommented
 
$(".selectXorO").click(function () {
    if ($(this).val() === "X") {
        human = "X";
        comp = "O";
    } else if ($(this).val() === "O") {
        human = "O";
        comp = "X";
    }
});

*/

$(".fillCell").click(function () {          // make this the code for the human to place her marker in the final version. 
    if (newGameData.totalMoves >= 9) {
        alert("Game Over. Click Reset to play again.");
    } else if (isHumanTurn === true) {
        placeMarker(this, human);
    } else {
        placeMarker(this, comp);
//        playGame();
    }
});

$("#reset").click(function () {
    $(".boardCell")
            .html("")
            .removeClass("Xmarker")
            .removeClass("Omarker");
    setupBoard();
    isHumanTurn = true;
    newGameData = new gameData();
    return newGameData;
});

$("#start").click(function () {
    playGame();
});

// game logic
function winOrBlock() {
    legitMove = false;
    var target = "";

    function pickCell(player) {
        for (var key of Object.keys(newGameData[player])) {
            var k = newGameData[player][key];
            if (k.length === 2) {
                var x = k.reduce(function (a, b) {
                    return Number(a) + Number(b);
                });
                var y = 15 - x;
                target = '.boardCell[value=' + y + ']';
                if ($(target).html() === "") {
                    legitMove = true;
                    return;
                } else {
                    legitMove = false;
                }
            }
        }
    }
    pickCell(comp);

    if (legitMove === true) {
        placeMarker(target, comp);
    } else {
        pickCell(human);
        if (legitMove === true) {
            placeMarker(target, comp);
        } else {
            return legitMove = false;
        }
    }

}

function playGame() {
    var last = newGameData.last[human];

    switch (newGameData.totalMoves) {
        case 0:
            placeMarker($(".boardCell[value=8]"), comp);
            break;
        case 1:
            if (last === 5) {
                placeMarker($(".boardCell[value=8]"), comp);
            } else {
                placeMarker($(".boardCell[value=5]"), comp);
            }
            break;
        case 2:
            if (last === 5) {
                placeMarker($(".boardCell[value=2]"), comp);
            } else if (last === 3) {
                placeMarker($(".boardCell[value=6]"), comp);
            } else {
                placeMarker($(".boardCell[value=4]"), comp);
            }
            break;
        case 3:
        case 4:
        case 5:
        case 6:
        default:
            winOrBlock();
            if (legitMove === false) {
                placeMarker($(".boardCell[value=2]"), comp);
            }
            break;
    }
}

/* routine for person going first
    human chooses edge
            computer chooses center
            human chooses edge that sums to 15
                computer chooses a corner
	If your opponent puts the second O on the opposite edge, making a row or column that reads O-X-O, 
            put your second X in a corner. Then, if your opponent puts the third O in the edge that is adjacent to your X, 
            making a line that reads O-X-O, put your third X in the empty square to block their row of two O's. From here, 
            you can always win with your fourth X
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
*/

$(document).ready(function () {
    setupBoard();
});
