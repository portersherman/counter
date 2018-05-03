const Y_AXIS = 1
const X_AXIS = 2

var players = []
var platforms = [];

function createPlayers() {
  	players[0] = new Player(200, height/4, color(255, 255, 255), 20, 3);
  	players[1] = new Player(200, 3*height/4, color(255, 255, 255), 20, 3);
}

function drawPlayers() {
    players.forEach((pi) => {
        pi.update();
        pi.detectEdges(0, players.length);
        pi.display();
        pi.detectCollisions(platforms);
    });
}

function drawPlatforms() {
    platforms.forEach((platGroup) => {
        platGroup.forEach((plat) => {
        	plat.display();
        })
    });
}

function createPlatform(playerId, playerNum) {
	var playerNum = players.length
	players.forEach((pi) => {
		var playerId = pi.getId();
		var recent = platforms[playerId - 1][platforms[playerId - 1].length - 1];
		if (!recent) {
			platforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), (height / (2 * playerNum)) * (playerId * 2 - 1), 80, 20, color(255)));
		} else if (millis() > recent.getTimeCreated() + recent.getRandDelay()) {
			var newY = recent.getSurface() + Math.round((Math.random()-0.5)*3)*20;
			newY = clamp(newY, (height / playerNum) * (playerId) - 100, (height / playerNum) * (playerId - 1) + 200);
			var newW = Math.random() * 200 + 50;
			platforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), newY, newW, 20, color(255)));
		}
	})
}

function clamp(x, upper, lower) {
	// console.log("upper: " + upper + " lower: " + lower + " x: " + x);
	return (x > upper) ? upper : (x < lower) ? lower : x;
}

function averagePlayerPos(players) {
	var accumX = 0;
	var avg = 0;
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
	for (var i = 0; i < players.length; i++) {
		players[i].applyForce(createVector(0, 3));
	}
}

function keyPressed() {
	if (!players[0].getFloating()) {
		if (key == "W") {
			players[0].applyForce(createVector(0, -200));
		}
	}
	if (!players[1].getFloating()) {
		if (keyCode == UP_ARROW) {
			players[1].applyForce(createVector(0, -200));
		}
	}
	return false;
}

function initPlatforms() {
	for (var i = 0; i < players.length; i++) {
		platforms.push([]);
	}
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    drawBackground();
    createPlayers();
    initPlatforms();
    createPlatform();
}

function advance() {
	translate(-averagePlayerPos(players) + width/5, 0);
}

function draw() {
	drawBackground();
	applyGravity();
	createPlatform();
	push();
	advance();
    drawPlayers();
    drawPlatforms();
    pop();
}