const board = document.getElementById('board');


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
createBoard();



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
placePieces();



let selectedPiece = null;

board.addEventListener('click', (e) => {
    const target = e.target;

   
    if (target.classList.contains('piece')) {
      
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
        return;
    }


    if (selectedPiece && target.classList.contains('dark') && !target.hasChildNodes()) {
        target.appendChild(selectedPiece);
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    }
});