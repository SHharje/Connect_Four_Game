var player1 = prompt('Player One: Enter your name, you will be blue'); // Player 1's name input
var player1Color = 'rgb(86, 151, 255)'; // Player 1's color (blue)

var player2 = prompt('Player Two: Enter your name, you will be red'); // Player 2's name input
var player2Color = 'rgb(237, 45, 73)'; // Player 2's color (red)

var game_on = true;
var game_over = false; // Flag to track if the game is over
var table = $('table tr');

function resetGame() {
    // Reset each cell's background color to empty gray ("rgb(192, 192, 192)")
    $('table button').css('background-color', 'rgb(192, 192, 192)');
    
    // Reset the game state
    currentPlayer = 1;
    currentName = player1;
    currentColor = player1Color;
    game_over = false; // Reset game_over flag
    
    // Reset the text and show the prompts again
    $('h1').text("Welcome to Connect Four");
    $('h3').text(currentName + ": it is your turn, please pick a column to drop your blue chip.");
    $('h2').fadeIn('fast');
    $('h3').fadeIn('fast');
}

// Add click event to the reset button
$('#resetButton').on('click', function() {
    resetGame(); // Call the reset function when the button is clicked
});

function reportWin(rowNum, colNum) {
    console.log("You won starting at this row col");
    console.log(rowNum);
    console.log(colNum);
}

function changeColor(row, col, color) {
    return table.eq(row).find('td').eq(col).find('button').css('background-color', color);
}

function returnColor(row, col) {
    return table.eq(row).find('td').eq(col).find('button').css('background-color');
}

function checkBottom(col) {
    // Check the bottom-most empty row in the selected column
    var colorReport = returnColor(5, col);
    for (var row = 5; row > -1; row--) {
        colorReport = returnColor(row, col); // Corrected `c` to `col`
        if (colorReport === "rgb(192, 192, 192)") { // Check if the cell is empty
            return row;
        }
    }
}

function colorMatchCheck(one, two, three, four) {
    // Checks if four colors match and aren't the empty background color
    return (one === two && two === three && three === four && one !== "rgb(192, 192, 192)" && one !== undefined);
}

function horizontalWinCheck() {
    // Check for a horizontal win across each row
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 4; col++) {
            if (colorMatchCheck(returnColor(row, col), returnColor(row, col + 1), returnColor(row, col + 2), returnColor(row, col + 3))) {
                console.log("Horizontal win");
                reportWin(row, col);
                return true;
            }
        }
    }
}

function verticalWinCheck() {
    // Check for a vertical win down each column
    for (var col = 0; col < 7; col++) {
        for (var row = 0; row < 3; row++) {
            if (colorMatchCheck(returnColor(row, col), returnColor(row + 1, col), returnColor(row + 2, col), returnColor(row + 3, col))) { // Fix vertical check by incrementing row, not col
                console.log("Vertical win");
                reportWin(row, col);
                return true;
            }
        }
    }
}

// Downward diagonal check (top-left to bottom-right)
function diagonalWinCheckDown() {
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 4; col++) {
            if (colorMatchCheck(returnColor(row, col), returnColor(row + 1, col + 1), returnColor(row + 2, col + 2), returnColor(row + 3, col + 3))) {
                console.log("Downward diagonal win");
                reportWin(row, col);
                return true;
            }
        }
    }
}

// Upward diagonal check (bottom-left to top-right)
function diagonalWinCheckUp() {
    for (var row = 3; row < 6; row++) {
        for (var col = 0; col < 4; col++) {
            if (colorMatchCheck(returnColor(row, col), returnColor(row - 1, col + 1), returnColor(row - 2, col + 2), returnColor(row - 3, col + 3))) {
                console.log("Upward diagonal win");
                reportWin(row, col);
                return true;
            }
        }
    }
}

function checkDraw() {
    // Loop through all rows and columns to check if any empty cell is left
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 7; col++) {
            if (returnColor(row, col) === "rgb(192, 192, 192)") {
                return false; // If there is an empty cell, it is not a draw
            }
        }
    }
    return true; // All cells are filled, it's a draw
}

var currentPlayer = 1;
var currentName = player1;
var currentColor = player1Color;

$('h3').text(player1 + " it is your turn, pick a column");

$(".board button").on('click', function () {
    if (game_over) return; // Stop clicks if the game is over (win or draw)

    var col = $(this).closest('td').index();
    var bottom = checkBottom(col);
    changeColor(bottom, col, currentColor);

    // Check if there is any winning combination
    if (horizontalWinCheck() || verticalWinCheck() || diagonalWinCheckDown() || diagonalWinCheckUp()) {
        $('h1').text(currentName + " You have won. 'PRESS RESET' start a new game");
        $('h3').fadeOut('fast');
        $('h2').fadeOut('fast');
        game_over = true; // Set game_over to true to disable further clicks
    } 
    // If no winner, check for a draw
    else if (checkDraw()) {
        $('h1').text("It's a draw!");
        $('h3').fadeOut('fast');
        $('h2').fadeOut('fast');
        game_over = true; // Set game_over to true to disable further clicks
    } 
    // If no winner and no draw, continue the game
    else {
        currentPlayer *= -1;

        if (currentPlayer === 1) {
            currentName = player1;
            $('h3').text(currentName + ": it is your turn, please pick a column to drop your blue chip.");
            currentColor = player1Color;
        } else {
            currentName = player2;
            $('h3').text(currentName + ": it is your turn, please pick a column to drop your red chip.");
            currentColor = player2Color;
        }
    }
});
