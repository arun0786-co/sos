const test = require('node:test');
const assert = require('node:assert');
const {sos_lines, board_full, count_openings} = require('../rules.js');

function empty(n) {
  return Array.from({length: n}, () => Array(n).fill(''));
}

test('o between two s makes one sos', () => {
  const b = empty(3);
  b[0][0] = 'S'; b[0][2] = 'S';
  assert.strictEqual(sos_lines(b, 0, 1, 'O').length, 1);
});

test('o in the middle can close all 4 axes at once', () => {
  const b = [['S', 'S', 'S'], ['S', '', 'S'], ['S', 'S', 'S']];
  assert.strictEqual(sos_lines(b, 1, 1, 'O').length, 4);
});

test('s at the end closes lines in any of the 8 directions', () => {
  const b = empty(5);
  b[0][2] = 'S'; b[1][2] = 'O';   // up
  b[2][0] = 'S'; b[2][1] = 'O';   // left
  b[4][4] = 'S'; b[3][3] = 'O';   // down right
  assert.strictEqual(sos_lines(b, 2, 2, 'S').length, 3);
});

test('lines never go off the board', () => {
  const b = empty(3);
  b[0][1] = 'O';
  assert.strictEqual(sos_lines(b, 0, 0, 'S').length, 0);
});

test('s next to s is not an sos', () => {
  const b = empty(3);
  b[0][0] = 'S'; b[0][1] = 'S';
  assert.strictEqual(sos_lines(b, 0, 2, 'S').length, 0);
});

test('board_full', () => {
  const b = [['S', 'O'], ['O', 'S']];
  assert.ok(board_full(b));
  b[1][1] = '';
  assert.ok(!board_full(b));
});

test('count_openings sees a gap the next player can fill', () => {
  const b = empty(3);
  b[0][0] = 'S'; b[0][2] = 'S';
  assert.strictEqual(count_openings(b), 1);
});
