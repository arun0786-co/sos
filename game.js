let boardsize = 7;
let board = [];

function intializeboard() {
  board = [];
  for (let i = 0; i < boardsize; i++) {
    let board = [];
    for (let j = 0; j < boardsize; j++) {
      board[i][j]= '';
    }
  }
} 

