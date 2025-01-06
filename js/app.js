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
    const target = e.target; // Get the clicked element

    // If a piece is clicked
    if (target.classList.contains('piece')) {
        // If the piece belongs to the current player
        if (target.classList.contains(currentPlayer)) {
            // Deselect the piece if it was already selected
            if (selectedPiece === target) {
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
            } else {
                // Deselect the previously selected piece, if any
                if (selectedPiece) {
                    selectedPiece.classList.remove('selected');
                }
                // Select the new piece
                selectedPiece = target;
                selectedPiece.classList.add('selected');
            }
        }
        return; // Exit function if a piece was clicked
    }

    // If a square is clicked and a piece is selected
    if (selectedPiece && target.classList.contains('dark') && !target.hasChildNodes()) {
        const parentSquare = selectedPiece.parentElement; // Get the square containing the selected piece
        const parentRow = parseInt(parentSquare.dataset.row); // Get the row of the parent square
        const parentCol = parseInt(parentSquare.dataset.col); // Get the column of the parent square
        const targetRow = parseInt(target.dataset.row); // Get the row of the target square
        const targetCol = parseInt(target.dataset.col); // Get the column of the target square

        const rowDiff = targetRow - parentRow; // Row difference between parent and target
        const colDiff = targetCol - parentCol; // Column difference between parent and target

        const isKing = selectedPiece.classList.contains('king'); // Check if the piece is a king

        // Handle single-square moves
        if (
            Math.abs(rowDiff) === 1 && // One square move
            Math.abs(colDiff) === 1 && // Diagonal move
            (isKing || // Kings can move any direction
                (currentPlayer === 'red' && rowDiff === -1) || // Red moves up
                (currentPlayer === 'black' && rowDiff === 1)) // Black moves down
        ) {
            target.appendChild(selectedPiece); // Move the piece
            selectedPiece.classList.remove('selected'); // Deselect the piece

            // Promote to king if reaching the opposite side
            if (currentPlayer === 'red' && targetRow === 0 && !isKing) {
                promoteToKing(selectedPiece);
            } else if (currentPlayer === 'black' && targetRow === 7 && !isKing) {
                promoteToKing(selectedPiece);
            }

            selectedPiece = null; // Clear the selected piece
            switchTurns(); // Switch turns
        }

        // Handle jumps
        if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            const jumpedRow = (parentRow + targetRow) / 2; // Row of the jumped piece
            const jumpedCol = (parentCol + targetCol) / 2; // Column of the jumped piece
            const jumpedSquare = document.querySelector(`[data-row="${jumpedRow}"][data-col="${jumpedCol}"]`);

            // Check if there's an opponent's piece to jump over
            const jumpedPiece = jumpedSquare ? jumpedSquare.firstChild : null;
            if (jumpedPiece && !jumpedPiece.classList.contains(currentPlayer)) {
                jumpedSquare.removeChild(jumpedPiece); // Remove the jumped piece

                target.appendChild(selectedPiece); // Move the piece
                selectedPiece.classList.remove('selected'); // Deselect the piece

                // Promote to king if reaching the opposite side
                if (currentPlayer === 'red' && targetRow === 0 && !isKing) {
                    promoteToKing(selectedPiece);
                } else if (currentPlayer === 'black' && targetRow === 7 && !isKing) {
                    promoteToKing(selectedPiece);
                }

                selectedPiece = null; // Clear the selected piece
                switchTurns(); // Switch turns
            }
        }
    }
});
