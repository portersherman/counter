class Player {
    constructor(x, y, c, m) {
        this.id = Player.incrementId();
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.mass = m;
        this.color = c;
        this.dampnig = 0.8
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId++;
        return this.latestId;
    }

    applyForce(f) {
        this.acc.add(f.copy().div(this.mass));
    }

    update() {
        this.vel.add(this.acc.copy());
        this.pos.add(this.vel.copy().mult(this.damping));
        this.acc.set(0,0);
    }

    display() {
        noStroke();
        fill(this.color);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, this.mass, this.mass);
    }

    getPos() {
        return this.pos;
    }

    detectEdges() {
        if (this.pos.y + this.mass/2 + 1 >= (height/2)*this.id) {
            this.pos.add(createVector(0, (height/2)*this.id - (this.pos.y + this.mass/2)));
            this.vel = createVector(0, 0);
        }
        if (this.pos.y - this.mass/2 <= (height/2)*(this.id - 1)) {
            this.pos.add(createVector(0, (height/2)*(this.id - 1) - (this.pos.y - this.mass/2)));
            this.vel = createVector(0, 0);
        }
    }
}
