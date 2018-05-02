class Player {
    constructor(x, y, c, m) {
        this.id = Player.incrementId();
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.mass = m;
        this.color = c;
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
        this.pos.add(this.vel.copy());
        this.acc.set(0,0);
    }

    display() {
        const {pos, color, mass} = this;

        noStroke();
        fill(color);
        ellipse(pos.x, pos.y, mass, mass);
    }
}
