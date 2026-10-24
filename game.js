//============ GAME VARIABLES ============
let lpwidth = 150;
let rpwidth = 150;
let tbheight = 100;
let bbheight = 80;

// board is drawn 650x650 inside the 700x700 middle area
let boardpx = 650;
let boardx = lpwidth + 25;
let boardy = tbheight + 25;

let bscore = 0;
let rscore = 0;
let bplayer = 'human';
let rplayer = 'human';

let selectedmode = 'simple';
let gameactive = false;
let boardsize = 7;
let board = [];
let currentplayer = 'blue';
let selectedcell = null;
let showletterbuttons = false;

let lines = [];   // sos lines made so far {r1, c1, r2, c2, player}
let moves = [];   // moves of the current game {player, row, col, letter}
let resulttext = '';
let message = '';
let messageuntil = 0;
let computerwait = 0;

// record and replay
let recording = false;
let recordedgame = null;
let replaying = false;
let replaystep = 0;
let replaynext = 0;

let bluecolor = [40, 90, 220];
let redcolor = [210, 40, 40];

// clickable areas
let simplebtn = {x: 168, y: 40, w: 135, h: 30};
let generalbtn = {x: 323, y: 40, w: 145, h: 30};
let minusbtn = {x: 620, y: 40, w: 30, h: 30};
let plusbtn = {x: 720, y: 40, w: 30, h: 30};
let recordbtn = {x: 100, y: tbheight + 720, w: 130, h: 40};
let replaybtn = {x: 270, y: tbheight + 720, w: 130, h: 40};
let newgamebtn = {x: 440, y: tbheight + 720, w: 130, h: 40};

function intializeboard() {
  board = [];
  for (let i = 0; i < boardsize; i++) {
    board[i] = [];
    for (let j = 0; j < boardsize; j++) {
      board[i][j] = '';
    }
  }
}

function setup() {
  createCanvas(lpwidth + 700 + rpwidth, tbheight + 700 + bbheight);  // 1000 x 880
  fitcanvas();
  loadrecordedgame();
  resetGame();
}

// shrink the canvas to fit small windows, p5 maps mouse positions back to canvas pixels
function fitcanvas() {
  let s = min(1, windowWidth / width, windowHeight / height);
  let c = document.querySelector('canvas');
  c.style.width = width * s + 'px';
  c.style.height = height * s + 'px';
}

function windowResized() {
  fitcanvas();
}

function draw() {
  background(240);
  if (replaying) {
    updatereplay();
  } else if (gameactive && iscomputerturn()) {
    updatecomputer();
  } else {
    computerwait = 0;
  }
  drawtb();
  drawpanel('blue');
  drawpanel('red');
  drawgameboard();
  drawbb();
  if (showletterbuttons && selectedcell) {
    drawletterselectionbuttons();
  }
}

//============ DRAWING ============

function drawtb() {
  stroke(0);
  strokeWeight(1);
  fill(200);
  rect(0, 0, width, tbheight);

  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(32);
  text('SOS', 25, 55);

  // mode radio buttons
  textSize(18);
  drawradio(180, 55, 'Simple game', selectedmode === 'simple');
  drawradio(335, 55, 'General game', selectedmode === 'general');

  // board size
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  text('Board size', 520, 55);
  drawbutton(minusbtn, '-', [230]);
  drawbutton(plusbtn, '+', [230]);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text(boardsize + ' x ' + boardsize, 685, 55);
  textSize(14);
  text('(3-9)', 785, 55);
}

function drawradio(x, y, label, on) {
  stroke(0);
  strokeWeight(1.5);
  fill(255);
  ellipse(x, y, 20, 20);
  if (on) {
    noStroke();
    fill(0);
    ellipse(x, y, 10, 10);
  }
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  text(label, x + 16, y);
}

function drawbutton(r, label, col) {
  stroke(0);
  strokeWeight(1);
  fill(col);
  rect(r.x, r.y, r.w, r.h, 4);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text(label, r.x + r.w / 2, r.y + r.h / 2);
}

function drawpanel(player) {
  let x = panelx(player);
  let w = player === 'blue' ? lpwidth : rpwidth;
  let mid = x + w / 2;
  let type = player === 'blue' ? bplayer : rplayer;

  stroke(0);
  strokeWeight(1);
  if (player === 'blue') {
    fill(100, 150, 255);
  } else {
    fill(250, 100, 100);
  }
  rect(x, tbheight, w, 700);

  // white border on the player whose turn it is
  let myturn = gameactive && currentplayer === player;
  if (myturn) {
    noFill();
    stroke(255);
    strokeWeight(5);
    rect(x + 4, tbheight + 4, w - 8, 692);
  }

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(player === 'blue' ? 'Blue Player' : 'Red Player', mid, tbheight + 25);

  // human computer toggle
  textSize(14);
  drawbutton(computerbtn(player), 'Computer', type === 'computer' ? [0, 200, 0] : [150]);
  drawbutton(humanbtn(player), 'Human', type === 'human' ? [0, 200, 0] : [150]);

  // score display
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Score', mid, tbheight + 160);
  textSize(40);
  text(player === 'blue' ? bscore : rscore, mid, tbheight + 200);

  if (myturn) {
    textSize(16);
    text('Your turn', mid, tbheight + 260);
  }
}

function drawgameboard() {
  let cs = cellsize();

  stroke(0);
  strokeWeight(2);
  fill(255);
  rect(boardx, boardy, boardpx, boardpx);

  // shade the last move so computer and replay moves are easy to follow
  if (moves.length > 0) {
    let last = moves[moves.length - 1];
    noStroke();
    fill(255, 240, 170);
    rect(boardx + last.col * cs, boardy + last.row * cs, cs, cs);
  }

  // grid lines
  stroke(0);
  strokeWeight(2);
  for (let i = 1; i < boardsize; i++) {
    line(boardx + i * cs, boardy, boardx + i * cs, boardy + boardpx);
    line(boardx, boardy + i * cs, boardx + boardpx, boardy + i * cs);
  }

  // letters
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(cs * 0.55);
  for (let i = 0; i < boardsize; i++) {
    for (let j = 0; j < boardsize; j++) {
      if (board[i][j] !== '') {
        text(board[i][j], cellcx(j), cellcy(i));
      }
    }
  }

  // sos lines in the color of the player who made them
  strokeWeight(max(3, cs / 14));
  for (let l of lines) {
    let col = l.player === 'blue' ? bluecolor : redcolor;
    stroke(col[0], col[1], col[2], 170);
    line(cellcx(l.c1), cellcy(l.r1), cellcx(l.c2), cellcy(l.r2));
  }
}

function drawbb() {
  let y = tbheight + 700;
  stroke(0);
  strokeWeight(1);
  fill(200);
  rect(0, y, width, bbheight);

  textSize(14);
  drawbutton(recordbtn, recording ? 'Recording: On' : 'Record Game', recording ? [240, 120, 120] : [150]);
  drawbutton(replaybtn, 'Replay', recordedgame ? [150] : [185]);
  drawbutton(newgamebtn, 'New Game', [100, 200, 100]);

  // status
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(statustext(), 790, y + 30);
  if (millis() < messageuntil) {
    fill(60);
    textSize(13);
    text(message, 790, y + 60);
  }
}

function drawletterselectionbuttons() {
  // dim everything and outline the chosen cell
  noStroke();
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);

  let cs = cellsize();
  noFill();
  stroke(255, 200, 0);
  strokeWeight(4);
  rect(boardx + selectedcell.col * cs, boardy + selectedcell.row * cs, cs, cs);

  let b = letterbuttons();
  stroke(0);
  strokeWeight(1);
  fill(255);
  rect(b.panel.x, b.panel.y, b.panel.w, b.panel.h, 6);
  textSize(32);
  drawbutton(b.s, 'S', [100, 200, 255]);
  drawbutton(b.o, 'O', [100, 200, 255]);
}

function statustext() {
  if (showletterbuttons) return 'Pick S or O (Esc cancels)';
  if (replaying) return 'Replay: move ' + replaystep + ' of ' + recordedgame.moves.length;
  if (!gameactive) return resulttext;
  let name = currentplayer === 'blue' ? 'Blue' : 'Red';
  return name + "'s turn" + (iscomputerturn() ? ' (computer)' : '');
}

function showmessage(text) {
  message = text;
  messageuntil = millis() + 3000;
}

//============ LAYOUT HELPERS ============

function cellsize() {
  return boardpx / boardsize;
}

function cellcx(col) {
  return boardx + col * cellsize() + cellsize() / 2;
}

function cellcy(row) {
  return boardy + row * cellsize() + cellsize() / 2;
}

function panelx(player) {
  return player === 'blue' ? 0 : lpwidth + 700;
}

function computerbtn(player) {
  return {x: panelx(player) + 15, y: tbheight + 50, w: 120, h: 28};
}

function humanbtn(player) {
  return {x: panelx(player) + 15, y: tbheight + 88, w: 120, h: 28};
}

// popup next to the chosen cell, above it when there is room, otherwise below
function letterbuttons() {
  let cs = cellsize();
  let w = 170;
  let h = 95;
  let cellx = boardx + selectedcell.col * cs;
  let celly = boardy + selectedcell.row * cs;
  let x = constrain(cellx + cs / 2 - w / 2, boardx, boardx + boardpx - w);
  let y = celly - h - 10 >= boardy ? celly - h - 10 : celly + cs + 10;
  return {
    panel: {x: x, y: y, w: w, h: h},
    s: {x: x + 15, y: y + 15, w: 65, h: 65},
    o: {x: x + 90, y: y + 15, w: 65, h: 65},
  };
}

function inrect(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

//============ INPUT ============

function mousePressed() {
  // the letter popup is modal: pick a letter or click anywhere else to cancel
  if (showletterbuttons) {
    let b = letterbuttons();
    if (inrect(b.s)) {
      chooseletter('S');
    } else if (inrect(b.o)) {
      chooseletter('O');
    } else {
      closeletterbuttons();
    }
    return;
  }

  if (inrect(simplebtn)) {
    setmode('simple');
  } else if (inrect(generalbtn)) {
    setmode('general');
  } else if (inrect(minusbtn)) {
    setboardsize(boardsize - 1);
  } else if (inrect(plusbtn)) {
    setboardsize(boardsize + 1);
  } else if (inrect(computerbtn('blue'))) {
    bplayer = 'computer';
  } else if (inrect(humanbtn('blue'))) {
    bplayer = 'human';
  } else if (inrect(computerbtn('red'))) {
    rplayer = 'computer';
  } else if (inrect(humanbtn('red'))) {
    rplayer = 'human';
  } else if (inrect(recordbtn)) {
    togglerecording();
  } else if (inrect(replaybtn)) {
    startreplay();
  } else if (inrect(newgamebtn)) {
    resetGame();
  } else if (inrect({x: boardx, y: boardy, w: boardpx, h: boardpx})) {
    clickcell();
  }
}

function keyPressed() {
  if (!showletterbuttons) return;
  if (key === 's' || key === 'S') {
    chooseletter('S');
  } else if (key === 'o' || key === 'O') {
    chooseletter('O');
  } else if (keyCode === ESCAPE) {
    closeletterbuttons();
  }
}

function clickcell() {
  if (!gameactive || replaying || iscomputerturn()) return;
  let cs = cellsize();
  let col = min(floor((mouseX - boardx) / cs), boardsize - 1);
  let row = min(floor((mouseY - boardy) / cs), boardsize - 1);
  if (board[row][col] !== '') return;
  selectedcell = {row: row, col: col};
  showletterbuttons = true;
}

function chooseletter(letter) {
  let cell = selectedcell;
  closeletterbuttons();
  placeletteronboard(cell.row, cell.col, letter);
}

function closeletterbuttons() {
  showletterbuttons = false;
  selectedcell = null;
}

function setmode(mode) {
  if (mode === selectedmode) return;
  selectedmode = mode;
  resetGame();
}

function setboardsize(n) {
  n = constrain(n, 3, 9);
  if (n === boardsize) return;
  boardsize = n;
  resetGame();
}

//============ GAME LOGIC ============

function switchplayer() {
  if (currentplayer === 'blue') {
    currentplayer = 'red';
  } else {
    currentplayer = 'blue';
  }
}

function placeletteronboard(row, col, letter) {
  if (!gameactive || board[row][col] !== '') return;

  board[row][col] = letter;
  moves.push({player: currentplayer, row: row, col: col, letter: letter});

  let found = checksos(row, col, letter);
  for (let l of found) {
    l.player = currentplayer;
    lines.push(l);
  }
  if (currentplayer === 'blue') {
    bscore += found.length;
  } else {
    rscore += found.length;
  }

  let name = currentplayer === 'blue' ? 'Blue' : 'Red';
  if (selectedmode === 'simple') {
    // first sos wins
    if (found.length > 0) {
      endgame(name + ' wins!');
    } else if (boardfull()) {
      endgame('Draw');
    } else {
      switchplayer();
    }
  } else {
    // most sos when the board is full wins, scoring earns another turn
    if (boardfull()) {
      if (bscore > rscore) {
        endgame('Blue wins!');
      } else if (rscore > bscore) {
        endgame('Red wins!');
      } else {
        endgame('Draw');
      }
    } else if (found.length > 0) {
      showmessage(name + ' made ' + found.length + ' SOS and goes again');
    } else {
      switchplayer();
    }
  }
}

// returns the sos lines made by placing letter at (row, col)
function checksos(row, col, letter) {
  let found = [];
  if (letter === 'O') {
    // o in the middle: s on both sides along each of the 4 axes
    for (let [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      if (getcell(row - dr, col - dc) === 'S' && getcell(row + dr, col + dc) === 'S') {
        found.push({r1: row - dr, c1: col - dc, r2: row + dr, c2: col + dc});
      }
    }
  } else {
    // s at one end: o then s in each of the 8 directions
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (getcell(row + dr, col + dc) === 'O' && getcell(row + 2 * dr, col + 2 * dc) === 'S') {
          found.push({r1: row, c1: col, r2: row + 2 * dr, c2: col + 2 * dc});
        }
      }
    }
  }
  return found;
}

// '' for cells off the board
function getcell(row, col) {
  if (row < 0 || row >= boardsize || col < 0 || col >= boardsize) return '';
  return board[row][col];
}

function boardfull() {
  return board.every(row => row.every(cell => cell !== ''));
}

function endgame(text) {
  gameactive = false;
  resulttext = text;
  if (recording && !replaying) savegame();
}

function resetGame() {
  intializeboard();
  currentplayer = 'blue';
  bscore = 0;
  rscore = 0;
  lines = [];
  moves = [];
  resulttext = '';
  gameactive = true;
  replaying = false;
  computerwait = 0;
  closeletterbuttons();
}

//============ COMPUTER PLAYER ============

function iscomputerturn() {
  return (currentplayer === 'blue' ? bplayer : rplayer) === 'computer';
}

function updatecomputer() {
  // short pause so computer moves can be followed
  if (computerwait === 0) {
    computerwait = millis() + 600;
  } else if (millis() >= computerwait) {
    computerwait = 0;
    computermove();
  }
}

// take the move that makes the most sos, otherwise the move that leaves the
// opponent the fewest sos to make
function computermove() {
  let scoring = [];
  let bestgain = 0;
  let safest = [];
  let leastrisk = Infinity;
  for (let row = 0; row < boardsize; row++) {
    for (let col = 0; col < boardsize; col++) {
      if (board[row][col] !== '') continue;
      for (let letter of ['S', 'O']) {
        let move = {row: row, col: col, letter: letter};
        let gain = checksos(row, col, letter).length;
        if (gain > 0) {
          if (gain > bestgain) {
            bestgain = gain;
            scoring = [];
          }
          if (gain === bestgain) scoring.push(move);
        } else if (bestgain === 0) {
          board[row][col] = letter;
          let risk = countopenings();
          board[row][col] = '';
          if (risk < leastrisk) {
            leastrisk = risk;
            safest = [];
          }
          if (risk === leastrisk) safest.push(move);
        }
      }
    }
  }
  let move = random(scoring.length > 0 ? scoring : safest);
  placeletteronboard(move.row, move.col, move.letter);
}

// how many sos the next player could make with one letter
function countopenings() {
  let count = 0;
  for (let row = 0; row < boardsize; row++) {
    for (let col = 0; col < boardsize; col++) {
      if (board[row][col] !== '') continue;
      count += checksos(row, col, 'S').length + checksos(row, col, 'O').length;
    }
  }
  return count;
}

//============ RECORD AND REPLAY ============

function togglerecording() {
  recording = !recording;
  if (!recording) {
    showmessage('Recording off');
  } else if (!gameactive && !replaying && moves.length > 0) {
    savegame();
  } else {
    showmessage('Recording on, the game is saved when it ends');
  }
}

function savegame() {
  recordedgame = {mode: selectedmode, size: boardsize, moves: moves.slice()};
  try {
    localStorage.setItem('sos-recorded-game', JSON.stringify(recordedgame));
  } catch (e) {
    // storage blocked, the game is still kept until the page is closed
  }
  showmessage('Game saved, press Replay to watch it');
}

function loadrecordedgame() {
  try {
    let saved = localStorage.getItem('sos-recorded-game');
    if (saved) recordedgame = JSON.parse(saved);
  } catch (e) {
    recordedgame = null;
  }
}

function startreplay() {
  if (!recordedgame) {
    showmessage('No recorded game yet, turn on Record first');
    return;
  }
  selectedmode = recordedgame.mode;
  boardsize = recordedgame.size;
  resetGame();
  replaying = true;
  replaystep = 0;
  replaynext = millis() + 500;
}

function updatereplay() {
  if (millis() < replaynext) return;
  let m = recordedgame.moves[replaystep];
  placeletteronboard(m.row, m.col, m.letter);
  replaystep++;
  replaynext = millis() + 700;
  if (replaystep >= recordedgame.moves.length) replaying = false;
}
