const Y_AXIS = 1
const X_AXIS = 2

var players = [];
var colors = [];
var background;
var currentColors = [];
var platforms = [];
var leftBuffer;
var oldLastLand;
var starting = false;

const DEV_OUTPUT = false;

const PLATFORM_HEIGHT = 20;
const LENGTHS = [100, 200, 400];
const PLATFORM_WIDTH = 400;
const PLATFORM_WIDTH_VARIANCE = 100;
const PLATFORM_MARGIN = 100;
const GRAVITY = 12;
const FREQS1 = [200, 250, 200, 150];
const FREQS2 = [125, 150, 125, 100];
var HORIZONTAL_SPEED = 6;
var COLOR_INDEX = 0;
var NEXT_COLOR_INDEX = 0;

var lerpFactor = 0.0;

function preload() {
    deathSound = loadSound('sound/aesthetic.mp3');
}

function devLog(...args) {
    if (DEV_OUTPUT) {
        args.forEach((a) => console.log(a));
    }
}

function getComplement(color) {
    var tempRGB;
    var tempHSV;
    tempRGB=color;
    tempHSV=RGB2HSV(tempRGB);
    tempHSV.hue=hueShift(tempHSV.hue, 180.0);
    tempRGB=HSV2RGB(tempHSV);
    return tempRGB;
}

function initPlayers() {
  	players[0] = new Player(200, 0, getComplement(colors[0]), HORIZONTAL_SPEED);
  	players[1] = new Player(200, 0, getComplement(colors[1]), HORIZONTAL_SPEED);
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
        platGroup["top"].forEach((plat) => {
        	plat.display();
        });
        platGroup["bottom"].forEach((plat) => {
        	plat.display();
        })
    });
}


function createPlatform() {
	var numPlayers = players.length;

	players.forEach((pi) => {
		var playerId = pi.getId();
        var recent, delta;
        var firstPush = false;

		if (!platforms[playerId - 1]["bottom"][platforms[playerId - 1]["bottom"].length - 1] || !platforms[playerId - 1]["top"][platforms[playerId - 1]["top"].length - 1]) {
			platforms[playerId - 1]["bottom"].push(new Platform(width + averagePlayerPos(players), (height / (2 * numPlayers)) * (playerId * 2 - 1) + (height / (4 * numPlayers)), LENGTHS[Math.floor(Math.random()*LENGTHS.length)], PLATFORM_HEIGHT, getColor(playerId), pi.getVel().x));
            platforms[playerId - 1]["top"].push(new Platform(width + averagePlayerPos(players), (height / (2 * numPlayers)) * (playerId * 2 - 1) - (height / (4 * numPlayers)), LENGTHS[Math.floor(Math.random()*LENGTHS.length)], PLATFORM_HEIGHT, getColor(playerId), pi.getVel().x));
            return;
		}
        recent = platforms[playerId - 1]["bottom"][platforms[playerId - 1]["bottom"].length - 1];
        if (frameCount > recent.getTimeCreated() + recent.getDelay()) {
            firstPush = true;
            // bottom
            if (recent.getSurface() > (height / numPlayers) * playerId - 3 * PLATFORM_HEIGHT) {
                delta = -PLATFORM_HEIGHT;
            } else if (recent.getSurface() < (height / (2 * numPlayers)) * (2 * playerId - 1) + 2 * PLATFORM_HEIGHT) {
                delta = PLATFORM_HEIGHT;
            } else {
                delta = 0;
                while (delta == 0) {
                    delta = Math.round((Math.random()-0.5)*3)*PLATFORM_HEIGHT;
                }
            }
			var newY = recent.getSurface() + delta;
			platforms[playerId - 1]["bottom"].push(new Platform(width + averagePlayerPos(players), newY, LENGTHS[Math.floor(Math.random()*LENGTHS.length)], PLATFORM_HEIGHT, getColor(playerId), pi.getVel().x));
        }
        recent = platforms[playerId - 1]["top"][platforms[playerId - 1]["top"].length - 1];
        if (frameCount > recent.getTimeCreated() + recent.getDelay()) {
            // top
            if (recent.getSurface() > (height / (2 * numPlayers)) * (2 * playerId - 1) - 2 * PLATFORM_HEIGHT) {
                delta = -PLATFORM_HEIGHT;
            } else if (recent.getSurface() < (height / numPlayers) * (playerId - 1) + 4 * PLATFORM_HEIGHT) {
                delta = PLATFORM_HEIGHT;
            } else {
                delta = 0;
                while (delta == 0) {
                    delta = Math.round((Math.random()-0.5)*3)*PLATFORM_HEIGHT;
                }
            }
			var newY = recent.getSurface() + delta;
			platforms[playerId - 1]["top"].push(new Platform(width + averagePlayerPos(players), newY, LENGTHS[Math.floor(Math.random()*LENGTHS.length)], PLATFORM_HEIGHT, getColor(playerId), pi.getVel().x));
		}
	})
}

function cullPlatforms() {
    platforms.forEach((platGroup) => {
        Object.keys(platGroup).forEach((k) => {
            var index = 0;
            platGroup[k].forEach((platform) => {
                if (platform.getRightSurface() < averagePlayerPos(players) - leftBuffer) {
                    platGroup[k].splice(index, 1);
                }
                index++;
            });
        });
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
	avg = accumX / players.length;
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
    return false;
}

function decColor() {
    if (lerpFactor >= 1.0) {
        lerpFactor = 0.0;
        NEXT_COLOR_INDEX = (COLOR_INDEX - 1 + colors.length/2) % (colors.length/2);
    }
}

function incColor() {
    if (lerpFactor >= 1.0) {
        lerpFactor = 0.0;
        NEXT_COLOR_INDEX = (COLOR_INDEX + 1 + colors.length/2) % (colors.length/2);
    }
}

function changeColors() {
    platforms[0]["top"].forEach((platform) => {
        platform.setColor(getColor(1));
    });
    platforms[1]["top"].forEach((platform) => {
        platform.setColor(getColor(2));
    });
    platforms[0]["bottom"].forEach((platform) => {
        platform.setColor(getColor(1));
    });
    platforms[1]["bottom"].forEach((platform) => {
        platform.setColor(getColor(2));
    });
}

function lerpUpdateFunction() {
    if (lerpFactor < 1.0) {
        changeColors();
        changeFilter();
        lerpFactor += 0.005;
    } else {
        COLOR_INDEX = NEXT_COLOR_INDEX;
    }
}

function getColor(player) {
    if (player == 1) {
        var from = (!starting) ? colors[COLOR_INDEX * 2 + 1] : color(255);
        var to = colors[NEXT_COLOR_INDEX * 2 +1]
        var lerpedColor = lerpColor(from, to, lerpFactor);
        return lerpedColor

        //return colors[COLOR_INDEX * 2 + 1];
    } else if (player == 2) {
        var from = (!starting) ? colors[COLOR_INDEX * 2] : color(255);
        var to = colors[NEXT_COLOR_INDEX * 2]
        var lerpedColor = lerpColor(from, to, lerpFactor);
        return lerpedColor

        //return colors[COLOR_INDEX * 2];
    } else {
        return null;
    }
}

function lerpFreq() {
    var delta1 = FREQS1[NEXT_COLOR_INDEX] - FREQS1[COLOR_INDEX];
    var delta2 = FREQS2[NEXT_COLOR_INDEX] - FREQS2[COLOR_INDEX];
    return [FREQS1[COLOR_INDEX] + delta1 * lerpFactor, FREQS2[COLOR_INDEX] + delta2 * lerpFactor];
}

function changeFilter() {
    Player.setFilterFreq(lerpFreq()[0], lerpFreq()[1]);
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
    leftBuffer = height/4;
	for (var i = 0; i < players.length; i++) {
        platforms.push({"top" : [], "bottom" : []});
	}
}

function initBackground() {
    background = new Background();
}

function updateBackground() {
    if (oldLastLand != players[0].getLastLand() && Math.abs(players[0].getLastLand() - players[1].getLastLand()) < 5) {
        oldLastLand = players[0].getLastLand();
        background.update();
    }
}

function setup() {
	frameRate(60);
    initColors(color(48, 255, 223));
    createCanvas(windowWidth, windowHeight);
    drawBackground();
    initPlayers();
    initPlatforms();
    initBackground();
    createPlatform();
}

function initColors(color) {
    colors[0] = color;
    colors[1] = getComplement(colors[0]);
    colors[2] = desaturate(color, 1.25);
    colors[3] = getComplement(colors[2]);
    colors[4] = color;
    colors[5] = getComplement(colors[4]);
    colors[6] = desaturate(color, 0.75);
    colors[7] = getComplement(colors[6]);
}

function advance() {
	translate(-averagePlayerPos(players) + leftBuffer, 0);
}

function draw() {
    if (frameCount < 300) {
        starting = true;
    } else {
        starting = false;
    }
    lerpUpdateFunction();
    updateBackground();
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
