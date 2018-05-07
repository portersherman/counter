/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/sketch.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/sketch.js":
/*!**************************!*\
  !*** ./public/sketch.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const Y_AXIS = 1\nconst X_AXIS = 2\n\nvar players = []\nvar platforms = [];\n\nfunction createPlayers() {\n  \tplayers[0] = new Player(200, height/4, color(255, 255, 255), 20, 3);\n  \tplayers[1] = new Player(200, 3*height/4, color(255, 255, 255), 20, 3);\n}\n\nfunction drawPlayers() {\n    players.forEach((pi) => {\n        pi.update();\n        pi.detectEdges(0, players.length);\n        pi.display();\n        pi.detectCollisions(platforms);\n    });\n}\n\nfunction drawPlatforms() {\n    platforms.forEach((platGroup) => {\n        platGroup.forEach((plat) => {\n        \tplat.display();\n        })\n    });\n}\n\nfunction createPlatform(playerId, playerNum) {\n\tvar playerNum = players.length\n\tplayers.forEach((pi) => {\n\t\tvar playerId = pi.getId();\n\t\tvar recent = platforms[playerId - 1][platforms[playerId - 1].length - 1];\n\t\tif (!recent) {\n\t\t\tplatforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), (height / (2 * playerNum)) * (playerId * 2 - 1), 80, 20, color(255)));\n\t\t} else if (millis() > recent.getTimeCreated() + recent.getRandDelay()) {\n\t\t\tvar newY = recent.getSurface() + Math.round((Math.random()-0.5)*3)*20;\n\t\t\tnewY = clamp(newY, (height / playerNum) * (playerId) - 100, (height / playerNum) * (playerId - 1) + 200);\n\t\t\tvar newW = Math.random() * 200 + 50;\n\t\t\tplatforms[playerId - 1].push(new Platform(width + averagePlayerPos(players), newY, newW, 20, color(255)));\n\t\t}\n\t})\n}\n\nfunction clamp(x, upper, lower) {\n\t// console.log(\"upper: \" + upper + \" lower: \" + lower + \" x: \" + x);\n\treturn (x > upper) ? upper : (x < lower) ? lower : x;\n}\n\nfunction averagePlayerPos(players) {\n\tvar accumX = 0;\n\tvar avg = 0;\n\tfor (let i = 0; i < players.length; i++) {\n\t\taccumX += players[i].getPos().x;\n\t}\n\tavg = accumX / players.length\n\treturn avg;\n}\n\nfunction drawBackground() {\n\t// fromTop = color(21, 251, 255);\n \t// toTop = color(21, 160, 255);\n \t// fromBottom = color(255, 21, 106);\n \t// toBottom= color(255, 127, 85);\n\t// setGradient(0, 0, width, height/2, fromTop, toTop, Y_AXIS);\n\t// setGradient(0, height/2, width, height/2, fromBottom, toBottom, Y_AXIS);\n\tnoStroke();\n\tfill(21, 240, 250);\n\trect(0, 0, width, height/2);\n\tfill(255, 21, 106);\n\trect(0, height/2, width, height/2);\n\t// stroke(255);\n\t// strokeWeight(2);\n\t// line(0, height/2, width, height/2);\n}\n\nfunction setGradient(x, y, w, h, c1, c2, axis) {\n  noFill();\n  if (axis == Y_AXIS) {  // Top to bottom gradient\n    for (var i = y; i <= y+h; i++) {\n      var inter = map(i, y, y+h, 0, 1);\n      var c = lerpColor(c1, c2, inter);\n      stroke(c);\n      line(x, i, x+w, i);\n    }\n  }  \n  else if (axis == X_AXIS) {  // Left to right gradient\n    for (var i = x; i <= x+w; i++) {\n      var inter = map(i, x, x+w, 0, 1);\n      var c = lerpColor(c1, c2, inter);\n      stroke(c);\n      line(i, y, i, y+h);\n    }\n  }\n}\n\nfunction applyGravity() {\n\tfor (var i = 0; i < players.length; i++) {\n\t\tplayers[i].applyForce(createVector(0, 3));\n\t}\n}\n\nfunction keyPressed() {\n\tif (!players[0].getFloating()) {\n\t\tif (key == \"W\") {\n\t\t\tplayers[0].applyForce(createVector(0, -200));\n\t\t}\n\t}\n\tif (!players[1].getFloating()) {\n\t\tif (keyCode == UP_ARROW) {\n\t\t\tplayers[1].applyForce(createVector(0, -200));\n\t\t}\n\t}\n\treturn false;\n}\n\nfunction initPlatforms() {\n\tfor (var i = 0; i < players.length; i++) {\n\t\tplatforms.push([]);\n\t}\n}\n\nfunction setup() {\n    createCanvas(windowWidth, windowHeight);\n    drawBackground();\n    createPlayers();\n    initPlatforms();\n    createPlatform();\n}\n\nfunction advance() {\n\ttranslate(-averagePlayerPos(players) + width/5, 0);\n}\n\nfunction draw() {\n\tdrawBackground();\n\tapplyGravity();\n\tcreatePlatform();\n\tpush();\n\tadvance();\n    drawPlayers();\n    drawPlatforms();\n    pop();\n}\n\n//# sourceURL=webpack:///./public/sketch.js?");

/***/ })

/******/ });