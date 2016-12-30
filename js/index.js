/* Email obfuscator script 2.1 by Tim Williams
 University of Arizona. Random encryption key feature by Andrew Moulden, Site Engineering Ltd. This code is freeware provided these four comment lines remain intact. A wizard to generate this code is at http://www.jottings.com/obfuscator/
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
var isHumanTurn = false;
var human = "O";
var comp = "X";
var gameOver = false;
var humanWon = false;
var newGameData;
var gameData = {
    board: ['a', 'b', 'c', 'A', 'B', 'C', 'd', 'D'], // row, columns, diagonals
    X: {},
    O: {},
    last: {},
    centerId: [5],
    cornerIds: [1, 3, 7, 9],
    edgeIds: [2, 4, 6, 8],
    totalMoves: 0
};

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
    newGameData = {};
    newGameData = $.extend({}, gameData, true);
    return $(".gameArea"), newGameData;
}
function placeMarker(cell, marker) {
    var updateGameData = function (marker) {
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
    };
    if ($(cell).html() !== "") {
        return false;
    } else if (marker === "X" && $(cell).html() === "") {
        $(cell)
                .toggleClass("Xmarker")
                .html("&#x2716;");
        updateGameData("X");
    } else if (marker === "O" && $(cell).html() === "") {
        $(cell)
                .toggleClass("Omarker")
                .html('<i class="fa fa-circle-o"></i>');
        updateGameData("O");
    } else {
        console.log("No choice found");
        return false;
    }
    isHumanTurn = !isHumanTurn;
    newGameData.totalMoves = Number(newGameData.totalMoves) + 1;
}

$(".selectXorO").click(function () {
    if ($(this).val() === "X") {
        human = "X";
        comp = "O";
    } else if ($(this).val() === "O") {
        human = "O";
        comp = "X";
    }
});

$(".fillCell").click(function () {          //this is just for testing; it shouldn't be in the final version
    if (isHumanTurn === false) {
        placeMarker(this, comp);
    } else {
        placeMarker(this, human);
    }
});

$("#reset").click(function () {
    $(".boardCell")
            .html("")
            .removeClass("Xmarker")
            .removeClass("Omarker");
    setupBoard();
    isHumanTurn = false;
    var newGameData = $.extend({}, gameData, true);
    return newGameData;
});
$("#start").click(function () {
    playGame_CompFirst(comp);
});

// game logic
function winOrBlock(marker) {
// finds two in a row and either wins or blocks
    // debugger;
    for (var key of Object.keys(newGameData[marker])) {
        var k = newGameData[marker][key];
        
        if (k.length === 3) {
            alert ("Game Over\n" + marker + " wins");
            return false;
        } else if (k.length === 2) {
            var x = k.reduce(function (a, b) { return +a + +b; });
            var y = 15 - x;
            var winBlockCell = '.boardCell[value=' + y + ']';
            if ($(winBlockCell).html() === "")  { 
                placeMarker(winBlockCell, comp);
                return true;
            } 
        } 
    }
    return false;
 }
    
function playGame_CompFirst() {
    var last = newGameData.last[human];
    
    switch (newGameData.totalMoves) {
        case 0:
            placeMarker($(".boardCell[value=8]"), comp);
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
        case 4:
            winOrBlock(comp);
            winOrBlock(human);
            placeMarker($(".boardCell[value=2]"), comp);
            break;
        case 6:
            winOrBlock(comp);
            winOrBlock(human); 
            if (winOrBlock(comp) === false && winOrBlock(human) === false) {
                placeMarker($(".boardCell[value=2]"), comp);             
            }
            break;
        default:
            winOrBlock(comp);
            winOrBlock(human);
            break;
    }
}


$(document).ready(function () {
    setupBoard();
});
