const Y_AXIS = 1
const X_AXIS = 2

let players = []

function createPlayers() {
  	players[0] = new Player(200, height/4, color(255, 255, 255), 20);
  	players[1] = new Player(200, 3*height/4, color(255, 255, 255), 20);
}

function drawPlayers() {
    players.forEach((pi) => {
        pi.update();
        pi.detectEdges();
        pi.display();
    })
}

function averagePlayerPos(players) {
	let accumX = 0;
	let avg = 0;
	for (let i = 0; i < players.length; i++) {
		accumX += players[i].getPos().x;
	}
	avg = accumX / players.length
	return avg;
}

function drawBackground() {
	// fromTop = color(21, 251, 255);
 	// toTop = color(21, 160, 255);
 	// fromBottom = color(255, 21, 106);
 	// toBottom= color(255, 127, 85);
	// setGradient(0, 0, width, height/2, fromTop, toTop, Y_AXIS);
	// setGradient(0, height/2, width, height/2, fromBottom, toBottom, Y_AXIS);
	noStroke();
	fill(21, 240, 250);
	rect(0, 0, width, height/2);
	fill(255, 21, 106);
	rect(0, height/2, width, height/2);
	// stroke(255);
	// strokeWeight(2);
	// line(0, height/2, width, height/2);
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}

function applyGravity() {
	for (let i = 0; i < players.length; i++) {
		players[i].applyForce(createVector(0, 1));
	}
}

function keyPressed() {
	if (key == "W") {
		players[0].applyForce(createVector(0, -100));
	}
	if (keyCode == UP_ARROW) {
		players[1].applyForce(createVector(0, -100));
	}
	return false;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    drawBackground();
    createPlayers();
}

function draw() {
	drawBackground();
	applyGravity();
	push();
	translate(-averagePlayerPos(players) + 100, 0);
    drawPlayers();
    pop();
}