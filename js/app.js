const board = document.getElementById('board');
let currentPlayer = 'red';
let selectedPiece = null;

function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
                square.dataset.row = row;
                square.dataset.col = col;
            }
            board.appendChild(square);
        }
    }
}

function placePieces() {
    const squares = document.querySelectorAll('.dark');
    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        if (row < 3) {
            const piece = document.createElement('div');
            piece.classList.add('piece', 'black');
            square.appendChild(piece);
        }
        if (row > 4) {
            const piece = document.createElement('div');
            piece.classList.add('piece', 'red');
            square.appendChild(piece);
        }
    });
}

createBoard();
placePieces();

function switchTurns() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    document.getElementById('turn-indicator').textContent = `Current Turn: ${currentPlayer}`;
}

function promoteToKing(piece) {
    if (piece) {
        piece.classList.add('king');
        console.log(`${currentPlayer} promoted to king!`);
    } else {
        console.error('Cannot promote to king: piece is null.');
    }
}

board.addEventListener('click', (e) => {
    const target = e.target;

    
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

   
    if (selectedPiece && target.classList.contains('dark') && !target.hasChildNodes()) {
        const parentSquare = selectedPiece.parentElement;
        const parentRow = parseInt(parentSquare.dataset.row);
        const parentCol = parseInt(parentSquare.dataset.col);
        const targetRow = parseInt(target.dataset.row);
        const targetCol = parseInt(target.dataset.col);

        const rowDiff = targetRow - parentRow;
        const colDiff = targetCol - parentCol;

        const isKing = selectedPiece.classList.contains('king');

        
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
        
          
           
            selectedPiece = null;            switchTurns();
        }

        
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
    }
});
