//ui layout 
let lpwidth = 150;// left panel width
let rpwidth = 150;// right panel width
let tbheight = 100;// top panel height
let bbheight = 80;// bottom panel height

// player info
let bscore = 0;
let rscore = 0;
let blueplayer = 'human';  // human or computer
let redplayer = 'human';   //   human or computer


let selectedmode = 'simple';  //simple or general
let gameactive = false;  

let boardsize = 7;
let board = [];


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
  if (bluePlayer === 'computer') {
    fill(0, 200, 0);
  } else {
    fill(150);
  }
  rect(x, y, 120, 25);
  fill(0);
  text('Computer', x + 10, y + 17);
  
  y += 35;
  
  // Human button
  if (bluePlayer === 'human') {
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
  text(blueScore, x + 50, y + 30);

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
  if (redPlayer === 'computer') {
    fill(0, 200, 0);
  } else {
    fill(150);
  }
  rect(x + 10, y, 120, 25);
  fill(0);
  text('Computer', x + 20, y + 17);
  
  y += 35;
  
  // Human button
  if (redPlayer === 'human') {
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
  text(redScore, x + 60, y + 30);
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
    line(boardX + i * cellSize, boardY, 
         boardX + i * cellSize, boardY + 700);
  }
  
  // horizontal lines 
  for (let i = 0; i <= boardsize; i++) {
    line(boardX, boardY + i * cellSize,
         boardX + 700, boardY + i * cellSize);
  }
   // Draw letters in cells
  for (let i = 0; i < boardsize; i++) {
    for (let j = 0; j < boardsize; j++) {
      let letter = board[i][j];
      if (letter !== '') {
        let x = boardX + j * cellSize + cellSize / 2;
        let y = boardY + i * cellSize + cellSize / 2;
        
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

