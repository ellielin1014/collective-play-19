// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// String being typed
let str = '';
// Is it my turn?
let myTurn = false;

let gameStart = false;
// Canvas element
let cnv;
// Margin;
let m = 10;

// List of sentences
let sen = ['thisthisthisthis', 'isisisisis', 'telephone','hello','world'];

let firstAdd = '';

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  // Disable canvas by deafult
  cnv.removeClass('fade');

  // Text styling
  textAlign(LEFT, TOP);
  textSize(32);

  // Draw string once connected
  //drawMessage();
  drawString();

  // Listen for my turn
  socket.on('go', function() {
    //drawMessage();
    myTurn = true;
    // Enable canvas
    //cnv.removeClass('disabled');
    cnv.addClass('fade');
    // Update instructions on screen
    background(255);
    if(myTurn){
    drawString();
  }

  });


  socket.on('add', function(data) {
  // Update string
  //str.replace(str,data);
  gameStart = true;
  if(str.endsWith("\n")){
  str = ''+ data;} else{
  str += data;}
  //res = str.replace(str,data)
  // Update string on screen
  cnv.removeClass('fade');
  if(myTurn){
  drawString();
}
});

  socket.on('remove', function() {
    // Remove characters from string
    str.slice(0, str.length-1);
    // Update string on screen
    if(myTurn){
    drawString();
  }
  });
}

// Draw string, character by character
function drawString() {
  // Draw a white background
  background(255);

  // Start in upper left-hand corner
  let x = m;
  let y = m;
  fill(0);

  // If there's nothing yet...
  // Show instructions
  if (str.length == 0 && gameStart === false) {
    let i = Math.floor((Math.random() * 4));
    text(myTurn ? sen[i] : 'wait...', x, y);
    // The above is the same as:
    // if (myTurn) text('type a word', x, y);
    // else text('wait...', x, y);

  }
  else {
    // Draw string, character by character
    for (let c = 0; c < str.length; c++) {
      let char = str.charAt(c);
      //char = char.replace(str,char);
      //let charSplit = split(char, "\n");
      // for (let i = 0; i < arr.length; i++) {
      //   arr[] = 'char';
      // }

      text(char, x, y);
      x += textWidth(char);
      // // Wrap text to next line
      if (x > width - m) {
        x = 0;
        y += textAscent('h') + textDescent('p');
      }
    }
  }
}


// Only listen for ASCII keystrokes
function keyTyped() {
  // Ignore if it's not your turn
  if (!myTurn) return;

  // Send data
  socket.emit('add', key);
}

// Delete things
function keyPressed() {
  // Ignore if it's not your turn
  if (!myTurn) return;

  // Send message to remove
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    socket.emit('remove');
  }
  // You're done with your turn at each word break
  else if (keyCode == ENTER) {
    // Send a space
    socket.emit('add', '\n' + '\n');
    socket.emit('next');
    // No longer your turn
    myTurn = false;
    // Disable canvas
    //cnv.addClass('disabled');
    cnv.removeClass('fade');
  }
}
