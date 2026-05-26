//ui layout 
let lpwidth = 150;// left panel width
let rpwidth = 150;// right panel width
let tbheight = 100;// top panel height
let bbheight = 80;// bottom panel height

// player info
let bscore = 0;
let rscore = 0;
let bplayer = 'human';  // human or computer
let rplayer = 'human';   //   human or computer


let selectedmode = 'simple';  //simple or general
let gameactive = false;  

let boardsize = 7;
let board = [];
currentplayer = 'blue'; // blue or red

function intializeboard() {
  for (let i = 0; i < boardsize; i++) {
    for (let j = 0; j < boardsize; j++) {
      board[i][j]= '';
    }
  }
} 

function setup() { 
  let canvaswidth = lpwidth + 700 +rpwidth;  // 1000
  let canvasheight = tbheight + 700 + bbheight;    // 800
  createCanvas(canvaswidth, canvasheight);  
  intializeboard();
}

function draw() {
  background(240);
  drawtb();
  drawlp();
  drawgameboard();
  drawrp();
  drawbb();
}

function drawtb() {
  fill(200);
  rect(0, 0, width, tbheight);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('SOS Game',20,30);

  fill(0);
  ellipse(270,60,20,20);//circle
  if(selectedmode === 'simple'){
    fill(0);
    ellipse(270,60,8,8);//checkmark
  }
  text(("Simple Mode"),50,65);
  noFill();
  stroke(0);
  ellipse(270,60,20,20);//circle
  if(selectedmode === 'general'){
    fill(0);
    ellipse(270,60,8,8);//checkmark
  }   
  fill(0);
  text('General Mode',300,65);


  // Board size label & input
  text('Board Size: ', 550, 65);
  text(boardsize + ' x ' + boardsize, 680, 65);
  
  // Board size slider area
  rect(550, 50, 200, 20);
  text('(Use 3-9)', 760, 65);
}

function drawlp() {// blue player controller 
  let x = 10;
  let y = tbheight + 20;
  fill(100,150,255);
  rect(0, tbheight, lpwidth, 700);
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text('Blue Player', x+70, y);
  y += 30;

  // human computer toggle; 
  textAlign(LEFT);
  textSize(12);


  // Computer button
  if (bplayer === 'computer') {
    fill(0, 200, 0);
  } else {
    fill(150);
  }
  rect(x, y, 120, 25);
  fill(0);
  text('Computer', x + 10, y + 17);
  
  y += 35;
  
  // Human button
  if (bplayer === 'human') {
    fill(0, 200, 0);
  } else {
    fill(150);
  }
  rect(x, y, 120, 25);
  fill(0);
  text('Human', x + 10, y + 17);
  
  // Score display
  y += 80;
  fill(0);
  textSize(14);
  text('Score:', x + 10, y);
  textSize(24);
  text(bscore, x + 50, y + 30);

}

function drawrp() {// redplayer 
  let x = width - rpwidth ;
  let y = tbheight + 20;

  fill(250,100,100);
  rect(x,tbheight, rpwidth, 700);

  fill(0);
  textSize(16);
  textAlign(CENTER);
  text('RED PLAYER', x + 75, y);
  
  y += 30;
  textAlign(LEFT);
  textSize(12);
  
  // Computer button
  if (rplayer === 'computer') {
    fill(0, 200, 0);
  } else {
    fill(150);
  }
  rect(x + 10, y, 120, 25);
  fill(0);
  text('Computer', x + 20, y + 17);
  
  y += 35;
  
  // Human button
  if (rplayer === 'human') {
    fill(0, 200, 0);
  } else {
    fill(150);
  }
  rect(x + 10, y, 120, 25);
  fill(0);
  text('Human', x + 20, y + 17);
  
  // Score display
  y += 80;
  fill(0);
  textSize(14);
  text('Score:', x + 20, y);
  textSize(24);
  text(rscore, x + 60, y + 30);
}

function drawgameboard() {
  let boardx = lpwidth+25;
  let boardy = tbheight+25;
  let cellsize = 700 / boardsize;
  // draw grid 
  stroke(0);
  strokeWeight(2);

  //vertical linen 
  for (let i = 0; i <= boardsize; i++) {
    line(boardx + i * cellsize, boardy, 
         boardx+ i * cellsize, boardy + 700);
  }
  
  // horizontal lines 
  for (let i = 0; i <= boardsize; i++) {
    line(boardx, boardy + i * cellsize,
         boardx + 700, boardy + i * cellsize);
  }
   // Draw letters in cells
  for (let i = 0; i < boardsize; i++) {
    for (let j = 0; j < boardsize; j++) {
      let letter = board[i][j];
      if (letter !== '') {
        let x = boardx + j * cellsize + cellsize / 2;
        let y = boardy + i * cellsize + cellsize / 2;
        
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(letter, x, y);
      }
    }
  }
}
function drawbb() {
   let y = height - bbheight;
   fill(200);
   rect(0, y, width, bbheight);
   fill(0);
   textSize(14);
   textAlign(CENTER, CENTER);
   
 // Record Game button
  fill(150);
  rect(100, y + 20, 120, 40);
  fill(0);
  text('Record Game', 160, y + 45);
  
  // Replay button
  fill(150);
  rect(280, y + 20, 120, 40);
  fill(0);
  text('Replay', 340, y + 45);
  
  // New Game button
  fill(100, 200, 100);
  rect(460, y + 20, 120, 40);
  fill(0);
  text('New Game', 520, y + 45);

}

function switchplayer() {
  if (currentplayer === 'blue') {
    currentplayer = 'red';
  } else {
    currentplayer = 'blue';
  }
}


function placeletteronboard(row, col, letter) {
  if (board[row][col] !== '') return;
  
  board[row][col] = letter;
  
  let score = checksos(row, col, letter);
  
  if (currentplayer === 'blue') {
    bscore += score;
  } else {
    rscore += score;
  }
  
  if (selectedmode === 'general' && score > 0) {
  } else {
    switchplayer();
  }
}



function mousePressed() {
  let boardx = lpwidth+25;
  let boardy = tbheight+25;
  let cellsize = 700 / boardsize;

  if (mouseX > boardx && mouseX < boardx + 700 &&
     mouseY > boardy && mouseY < boardy + 700) {
     
      let col = floor((mouseX - boardx) / cellsize);
      let row = floor((mouseY - boardy) / cellsize);

      let choice = prompt("Enter 'S' or 'O':").toUpperCase();
      if (choice === 'S' || choice === 'O') {
         placeletteronboard(row, col, choice);
      }}

  //handling other button clicks (mode selection, player type, new game, etc.) would go here
  if (mouseX > 250 && mouseX < 290 && mouseY > 50 && mouseY < 70) {
    selectedmode = (selectedmode === 'simple') ? 'general' : 'simple';
  } else if (mouseX > 10 && mouseX < 130 && mouseY > tbheight + 50 && mouseY < tbheight + 75) {
    bplayer = (bplayer === 'human') ? 'computer' : 'human';
  } else if (mouseX > 10 && mouseX < 130 && mouseY > tbheight + 85 && mouseY < tbheight + 110) {
    bplayer = (bplayer === 'computer') ? 'human' : 'computer';
  } else if (mouseX > width - rpwidth + 10 && mouseX < width - rpwidth + 130 && mouseY > tbheight + 50 && mouseY < tbheight + 75) {
    rplayer = (rplayer === 'human') ? 'computer' : 'human';
  } else if (mouseX > width - rpwidth + 10 && mouseX < width - rpwidth + 130 && mouseY > tbheight + 85 && mouseY < tbheight + 110) {
    rplayer = (rplayer === 'computer') ? 'human' : 'computer';
  } else if (mouseX > 100 && mouseX < 220 && mouseY > height - bbheight + 20 && mouseY < height - bbheight + 60) {
    // Record Game button clicked
    // Implement recording logic here
  } else if (mouseX > 280 && mouseX < 400 && mouseY > height - bbheight + 20 && mouseY < height - bbheight + 60) {
    // Replay button clicked
    // Implement replay logic here
  } else if (mouseX > 460 && mouseX < 580 && mouseY > height - bbheight + 20 && mouseY < height - bbheight + 60) {
    // New Game button clicked
    resetGame();
  }

}


function checksos(row, col, letter) {
  if (letter !== 'O') return 0; 
  
  let score = 0;
  
  //check horizontal 
  if (col > 0 && col < boardsize-1 && 
    board[row][col-1] === 'S' && board[row][col+1] === 'S') {
    score++;
  }
  
  //check vertical 
  if (row > 0 && row < boardsize-1 && 
    board[row-1][col] === 'S' && board[row+1][col] === 'S') {  
    score++;
  }
  
  // Check diagonals 
  if(row > 0 && row < boardsize-1 && ol > 0 && col < boardsize-1 && 
    board[row-1][col-1] === 'S' && board[row+1][col+1] === 'S'){
    score++;
  }
 
  if(row > 0 && row < boardsize-1 && ol > 0 && col < boardsize-1 && 
    board[row+1][col-1] === 'S' && board[row-1][col+1] === 'S'){

    score++;

  }
  return score;
}


function resetGame() {
  intializeboard();
  currentplayer = 'blue';
  bscore = 0;
  rscore = 0;
  gameactive = true;
  selectedmode = 'simple';
}




