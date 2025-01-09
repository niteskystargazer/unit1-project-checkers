  // Get the button and audio element
  const playButton = document.getElementById('playButton');
  const audio = document.getElementById('audio');

  // Add click event listener to the button
  playButton.addEventListener('click', () => {
      // Play the audio when the button is clicked
      audio.play().then(() => {
          console.log('Audio is playing');
      }).catch((error) => {
          console.error('Error playing audio:', error);
      });
  });

// Select the board element from the DOM
const board = document.getElementById('board');

// Track the current player ('red' or 'black')
let currentPlayer = 'red';

// Store the currently selected piece, if any
let selectedPiece = null;

// Function to create the checkers board
function createBoard() {
    for (let row = 0; row < 8; row++) { // Loop through rows
        for (let col = 0; col < 8; col++) { // Loop through columns
            const square = document.createElement('div'); // Create a square
            square.classList.add('square'); // Add the 'square' class

            // Alternate between light and dark squares
            if ((row + col) % 2 === 0) {
                square.classList.add('light'); // Light square
            } else {
                square.classList.add('dark'); // Dark square
                // Add data attributes to track the row and column
                square.dataset.row = row;
                square.dataset.col = col;
            }
            board.appendChild(square); // Add square to the board
        }
    }
}

// Function to place pieces on the board
function placePieces() {
    const squares = document.querySelectorAll('.dark'); // Select all dark squares
    squares.forEach(square => {
        const row = parseInt(square.dataset.row); // Get the row of the square

        // Place black pieces on the top 3 rows
        if (row < 3) {
            const piece = document.createElement('div');
            piece.classList.add('piece', 'black'); // Add 'piece' and 'black' classes
            square.appendChild(piece); // Place the piece on the square
        }

        // Place red pieces on the bottom 3 rows
        if (row > 4) {
            const piece = document.createElement('div');
            piece.classList.add('piece', 'red'); // Add 'piece' and 'red' classes
            square.appendChild(piece); // Place the piece on the square
        }
    });
}

// Initialize the board and pieces
createBoard();
placePieces();

// Function to switch turns between players
function switchTurns() {
    // Toggle the current player
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';

    // Update the turn indicator in the DOM
    document.getElementById('turn-indicator').textContent = `Current Turn: ${currentPlayer}`;
    checkGameOver(); // Check for game over conditions
}

// Function to promote a piece to a king
function promoteToKing(piece) {
    if (piece) {
        piece.classList.add('king'); // Add the 'king' class to the piece
        console.log(`${currentPlayer} promoted to king!`);
    } else {
        console.error('Cannot promote to king: piece is null.');
    }
}

// Add a click event listener to the board
board.addEventListener('click', (e) => {
    const target = e.target;

    // If a piece is clicked
    if (target.classList.contains('piece')) {
        if (target.classList.contains(currentPlayer)) {
            if (selectedPiece === target) {
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
            } else {
                if (selectedPiece) {
                    selectedPiece.classList.remove('selected');
                }
                selectedPiece = target;
                selectedPiece.classList.add('selected');
            }
        }
        return;
    }

    // If a square is clicked and a piece is selected
    if (selectedPiece && target.classList.contains('dark') && !target.hasChildNodes()) {
        const parentSquare = selectedPiece.parentElement;
        const parentRow = parseInt(parentSquare.dataset.row);
        const parentCol = parseInt(parentSquare.dataset.col);
        const targetRow = parseInt(target.dataset.row);
        const targetCol = parseInt(target.dataset.col);

        const rowDiff = targetRow - parentRow;
        const colDiff = targetCol - parentCol;

        const isKing = selectedPiece.classList.contains('king');

        // Handle single-square moves
        if (
            Math.abs(rowDiff) === 1 &&
            Math.abs(colDiff) === 1 &&
            (isKing ||
                (currentPlayer === 'red' && rowDiff === -1) ||
                (currentPlayer === 'black' && rowDiff === 1))
        ) {
            target.appendChild(selectedPiece);
            selectedPiece.classList.remove('selected');

            if (currentPlayer === 'red' && targetRow === 0 && !isKing) {
                promoteToKing(selectedPiece);
            } else if (currentPlayer === 'black' && targetRow === 7 && !isKing) {
                promoteToKing(selectedPiece);
            }

            selectedPiece = null;
            switchTurns();
        }

        // Handle jumps
        if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            const jumpedRow = (parentRow + targetRow) / 2;
            const jumpedCol = (parentCol + targetCol) / 2;
            const jumpedSquare = document.querySelector(`[data-row="${jumpedRow}"][data-col="${jumpedCol}"]`);

            const jumpedPiece = jumpedSquare ? jumpedSquare.firstChild : null;
            if (jumpedPiece && !jumpedPiece.classList.contains(currentPlayer)) {
                jumpedSquare.removeChild(jumpedPiece);
                target.appendChild(selectedPiece);
                selectedPiece.classList.remove('selected');

                if (currentPlayer === 'red' && targetRow === 0 && !isKing) {
                    promoteToKing(selectedPiece);
                } else if (currentPlayer === 'black' && targetRow === 7 && !isKing) {
                    promoteToKing(selectedPiece);
                }

                selectedPiece = null;
                switchTurns();
            }
        }

        // Check game over after any move or jump
        checkGameOver();
    }
});



function checkGameOver() {
    const allPieces = document.querySelectorAll('.piece');
    let redCount = 0;
    let blackCount = 0;

    allPieces.forEach(piece => {
        if (piece.classList.contains('red')) {
            redCount++;
        } else if (piece.classList.contains('black')) {
            blackCount++;
        }
    });

    // Check if either player has no pieces left
    if (redCount === 0) {
        document.getElementById('winner').textContent = ("BLACK WINS!!!");
    } else if (blackCount === 0) {
        document.getElementById('winner').textContent = ("RED WINS!!!");
        endGame();
    }

    // Check if the current player has any valid moves
    const currentPieces = document.querySelectorAll(`.piece.${currentPlayer}`);
    let hasValidMove = false;

    currentPieces.forEach(piece => {
        const parentSquare = piece.parentElement;
        const row = parseInt(parentSquare.dataset.row);
        const col = parseInt(parentSquare.dataset.col);

        // Check potential moves (diagonal and jump)
        const directions = currentPlayer === 'red' || piece.classList.contains('king')
            ? [-1, 1] // Red and kings move up
            : [1];    // Black moves down

        directions.forEach(rowDir => {
            [-1, 1].forEach(colDir => {
                const targetRow = row + rowDir;
                const targetCol = col + colDir;
                const targetSquare = document.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`);

                // If the target square is empty or a valid jump
                if (targetSquare && !targetSquare.hasChildNodes()) {
                    hasValidMove = true;
                }
            });
        });
    });

    if (!hasValidMove) {
        document.getElementById('winner').textContent = (`${currentPlayer === 'red' ? 'Black' : 'Red'} wins! ${currentPlayer} has no valid moves.`);
        endGame();
    }
}


function endGame() {
    // Display the burn effect animation
    const burnEffect = document.getElementById('burn-effect');
    burnEffect.style.animation = 'burnAway 10s ease-out forwards'; // 10s burn effect

    // Display the "GAME OVER!" text
    const gameOverText = document.getElementById('game-over-text');
    gameOverText.style.animation = 'textFadeIn 10s ease-out forwards'; // 10s fade-in effect for text

    // Disable board interactions
    board.removeEventListener('click', handleClick);
    document.getElementById('turn-indicator').textContent = 'Game Over!';

    // Clear the page content after the animation
    setTimeout(() => {
        document.body.innerHTML = '<h1>Game Over!</h1>';
    }, 10000); // Page clears after 10s, after burn animation finishes
}
