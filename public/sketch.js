const Y_AXIS = 1
const X_AXIS = 2

var players = [];
var colors = [];
var platforms = [];
var leftBuffer;

const DEV_OUTPUT = false;

function devLog(...args) {
    if (DEV_OUTPUT) {
        args.forEach((a) => console.log(a));
    }
}

function getComplement(color) {
    var temprgb;
    var temphsv;
    temprgb=color;
    temphsv=RGB2HSV(temprgb);
    temphsv.hue=HueShift(temphsv.hue, 180.0);
    temprgb=HSV2RGB(temphsv);
    return temprgb;
}

function createPlayers() {
  	players[0] = new Player(200, height/4, getComplement(colors[0]), 20, 3);
    temprgb=colors[1];
	temphsv=RGB2HSV(temprgb);
	temphsv.hue=HueShift(temphsv.hue, 180.0);
    temprgb=HSV2RGB(temphsv);
  	players[1] = new Player(200, 3*height/4, getComplement(colors[1]), 20, 3);
    players.forEach((pi) => {
        pi.restart();
    });
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

var PLATFORM_HEIGHT = 20;

function createPlatform(playerId, playerNum) {
	var playerNum = players.length
	players.forEach((pi) => {
		var playerId = pi.getId();
		var recent = platforms[playerId - 1][platforms[playerId - 1].length - 1];
		if (!recent) {
			platforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), (height / (2 * playerNum)) * (playerId * 2 - 1), 80, PLATFORM_HEIGHT, color(255), pi.getVel().x));
		} else if (frameCount > recent.getTimeCreated() + recent.getRandDelay()) {
			var newY = recent.getSurface() + Math.round((Math.random()-0.5)*3)*20;
			newY = clamp(newY, (height / playerNum) * (playerId) - 100, (height / playerNum) * (playerId - 1) + 200);
			var newW = Math.random() * 200 + 50;
			platforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), newY, newW, PLATFORM_HEIGHT, color(255), pi.getVel().x));
		}
	})
}

function cullPlatforms() {
    platforms.forEach((platGroup) => {
        for (let i = 0; i < platGroup.length; i++) {
            if (platGroup[i].getRightSurface() < averagePlayerPos(players) - leftBuffer) {
                platGroup.splice(i, 1);
            }
        }
    });
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
	fill(colors[0]);
	rect(0, 0, width, height/2);
	fill(colors[1]);
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
		players[i].applyForce(createVector(0, 10));
	}
}

var jumpForce = -300;
var fallForce = 120;``

function keyPressed() {
	if (players[0].canJump()) {
		if (key == "W") {
      players[0].start();
      players[0].jump();
			players[0].applyForce(createVector(0, jumpForce));
		}
	}
	if (players[1].canJump()) {
		if (keyCode == UP_ARROW) {
      players[1].start();
      players[1].jump();
			players[1].applyForce(createVector(0, jumpForce));
		}
	}
	return false;
}

function keyReleased() {
    if (players[0].isFloating() && players[0].vel.y < -3) {
        if (key == "W") {
            players[0].applyForce(createVector(0, fallForce));
        }
    }
    if (players[1].isFloating() && players[1].vel.y < -3) {
        if (keyCode == UP_ARROW) {
            players[1].applyForce(createVector(0, fallForce));
        }
    }
    return false;
}

function initPlatforms() {
    leftBuffer = width/5;
	for (var i = 0; i < players.length; i++) {
		platforms.push([]);
	}
}

function setup() {
	frameRate(60);
    colors[0] = color(21, 240, 250);
    colors[1] = getComplement(colors[0]);
    createCanvas(windowWidth, windowHeight);
    drawBackground();
    createPlayers();
    initPlatforms();
    createPlatform();

}

function advance() {
	translate(-averagePlayerPos(players) + leftBuffer, 0);
}

function draw() {
    cullPlatforms();
	drawBackground();
	applyGravity();
	createPlatform();
	push();
	advance();
    drawPlayers();
    drawPlatforms();
    pop();
}
