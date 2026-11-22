// sos rules with no drawing, so they can be tested in node.
// a board is an array of rows, each cell '', 'S' or 'O'.

// '' for cells off the board
function cell_at(board, row, col) {
  if (row < 0 || row >= board.length || col < 0 || col >= board.length) return '';
  return board[row][col];
}

// the sos lines made by putting letter at (row, col)
function sos_lines(board, row, col, letter) {
  let found = [];
  if (letter === 'O') {
    // o in the middle: s on both sides along each of the 4 axes
    for (let [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      if (cell_at(board, row - dr, col - dc) === 'S' && cell_at(board, row + dr, col + dc) === 'S') {
        found.push({r1: row - dr, c1: col - dc, r2: row + dr, c2: col + dc});
      }
    }
  } else {
    // s at one end: o then s in each of the 8 directions
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (cell_at(board, row + dr, col + dc) === 'O' && cell_at(board, row + 2 * dr, col + 2 * dc) === 'S') {
          found.push({r1: row, c1: col, r2: row + 2 * dr, c2: col + 2 * dc});
        }
      }
    }
  }
  return found;
}

function board_full(board) {
  return board.every(r => r.every(c => c !== ''));
}

// how many sos the next player could make with one letter
function count_openings(board) {
  let count = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (board[row][col] !== '') continue;
      count += sos_lines(board, row, col, 'S').length + sos_lines(board, row, col, 'O').length;
    }
  }
  return count;
}

if (typeof module !== 'undefined') {
  module.exports = {cell_at, sos_lines, board_full, count_openings};
}
