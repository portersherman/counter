let players = []

function createPlayers() {
    for (let i = 0; i < 1; i++) {
        players[i] = new Player(10, 10, color(255, 255, 255), 5)
    }
}

function drawPlayers() {
    players.forEach((pi) => {
        pi.update()
        pi.display()
    })
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(color(0, 0, 0))
    createPlayers()
}

function draw() {
    drawPlayers()
}