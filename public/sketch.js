const Y_AXIS = 1
const X_AXIS = 2

var players = [];
var colors = [];
var background;
var currentColors = [];
var platforms = [];
var leftBuffer;

const DEV_OUTPUT = false;

const PLATFORM_HEIGHT = 20;
const PLATFORM_WIDTH = 400;
const PLATFORM_WIDTH_VARIANCE = 100;
const PLATFORM_MARGIN = 100;
const GRAVITY = 12;
var HORIZONTAL_SPEED = 6;
var COLOR_INDEX = 0;
var NEXT_COLOR_INDEX = 0;

var colorLerpFactor = 0.0;

function preload() {
    deathSound = loadSound('sound/aesthetic.mp3');
}

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

function initPlayers() {
  	players[0] = new Player(200, 0, getComplement(colors[0]), HORIZONTAL_SPEED, deathSound);
    temprgb=colors[1];
	temphsv=RGB2HSV(temprgb);
	temphsv.hue=HueShift(temphsv.hue, 180.0);
    temprgb=HSV2RGB(temphsv);
  	players[1] = new Player(200, 0, getComplement(colors[1]), HORIZONTAL_SPEED, deathSound);
    players.forEach((pi) => {
        pi.restart();
    });
}

function drawPlayers() {
    players.forEach((pi) => {
        pi.setColor(getColor(pi.id));
        pi.update();
        pi.detectEdges(0, players.length);
        pi.display();
        pi.detectCollisions(platforms);
    });
}

function drawScores() {
    players.forEach((pi) => {
        fill(255);
        textSize(50);
        textFont("Courier");
        text(pi.getScore(), width - 50, (height/players.length)*(pi.getId() - 1) + 65);
    });
}

function drawPlatforms() {
    platforms.forEach((platGroup) => {
        platGroup.forEach((plat) => {
        	plat.display();
        })
    });
}


function createPlatform(playerId, numPlayers) {
	var numPlayers = players.length
	players.forEach((pi) => {
		var playerId = pi.getId();
		var recent = platforms[playerId - 1][platforms[playerId - 1].length - 1];
		if (!recent) {
			platforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), (height / (2 * numPlayers)) * (playerId * 2 - 1), 200, PLATFORM_HEIGHT, getColor(playerId), pi.getVel().x));
		} else if (frameCount > recent.getTimeCreated() + recent.getRandDelay()) {
            var delta;
            if (recent.getSurface() > (height / numPlayers) * (playerId) - 2 * PLATFORM_HEIGHT) {
                delta = -PLATFORM_HEIGHT;
            } else if (recent.getSurface() < (height / numPlayers) * (playerId - 1) + PLATFORM_HEIGHT + PLATFORM_MARGIN) {
                delta = PLATFORM_HEIGHT;
            } else {
                delta = 0
                while (delta == 0) {
                    delta = Math.round((Math.random()-0.5)*3)*PLATFORM_HEIGHT;
                }
            }
			var newY = recent.getSurface() + delta;
			var newW = (Math.random() * PLATFORM_WIDTH) + PLATFORM_WIDTH_VARIANCE;
			platforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), newY, newW, PLATFORM_HEIGHT, getColor(playerId), pi.getVel().x));
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
	fill(getColor(2));
	rect(0, 0, width, height/2);
	fill(getColor(1));
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
		players[i].applyForce(createVector(0, GRAVITY));
	}
}

var jumpForce = -300;
var jumpVel = -14.4
var fallForce = 100;

function keyPressed() {
	if (players[0].canJump()) {
		if (key == "W") {
            players[0].jump();
			players[0].applyForce(createVector(0, jumpForce));
            return false;
		}
	}
	if (players[1].canJump()) {
		if (keyCode == UP_ARROW) {
            players[1].jump();
			players[1].applyForce(createVector(0, jumpForce));
            return false;
		}
	}
    if (key == "A") {
        decColor();
        return false;
    }
    if (keyCode == LEFT_ARROW) {
        decColor();
        return false;
    }
    if (key == "D") {
        incColor();
        return false;
    }
    if (keyCode == RIGHT_ARROW) {
        incColor();
        return false;
    }
}

function decColor() {
    if (COLOR_INDEX > 0 && colorLerpFactor >= 1.0) {
        colorLerpFactor = 0.0;
        NEXT_COLOR_INDEX = COLOR_INDEX - 1;
        //COLOR_INDEX--;
    }
}

function incColor() {
    if (COLOR_INDEX < colors.length / 2 - 1  && colorLerpFactor >= 1.0) {
        colorLerpFactor = 0.0;
        NEXT_COLOR_INDEX = COLOR_INDEX + 1;
        //COLOR_INDEX++;
    }
}

function changeColors() {
    players[0].setColor(getColor(1));
    players[1].setColor(getColor(2));
    platforms[0].forEach((platform) => {
        platform.setColor(getColor(1));
    });
    platforms[1].forEach((platform) => {
        platform.setColor(getColor(2));
    });
}

function tomsDnakUpdateFunction() {
    if (colorLerpFactor < 1.0) {
        changeColors()
        colorLerpFactor += 0.01;
    } else {
        COLOR_INDEX = NEXT_COLOR_INDEX;
        //colorLerpFactor = 0.0;
    }
}

function getColor(player) {
    if (player == 1) {
        var from = colors[COLOR_INDEX * 2 + 1];
        var to = colors[NEXT_COLOR_INDEX * 2 +1]
        var lerpedColor = lerpColor(from, to, colorLerpFactor);
        return lerpedColor

        //return colors[COLOR_INDEX * 2 + 1];
    } else if (player == 2) {
        var from = colors[COLOR_INDEX * 2];
        var to = colors[NEXT_COLOR_INDEX * 2]
        var lerpedColor = lerpColor(from, to, colorLerpFactor);
        return lerpedColor

        //return colors[COLOR_INDEX * 2];
    } else {
        return null;
    }
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

function initBackground() {
    background = new Background();
}

function setup() {
	frameRate(60);
    initColors();
    createCanvas(windowWidth, windowHeight);
    drawBackground();
    initPlayers();
    initPlatforms();
    initBackground();
    createPlatform();
}

function initColors() {
    colors[0] = color(48, 255, 223);
    colors[1] = getComplement(colors[0]);
    colors[2] = color(255, 230, 73);
    colors[3] = getComplement(colors[2]);
    colors[4] = color(178, 72, 157);
    colors[5] = getComplement(colors[4]);
}

function advance() {
	translate(-averagePlayerPos(players) + leftBuffer, 0);
}

function draw() {
    tomsDnakUpdateFunction();
    cullPlatforms();
	drawBackground();
    // drawScores();
	applyGravity();
	createPlatform();
	push();
	advance();
    drawPlayers();
    drawPlatforms();
    pop();


}
