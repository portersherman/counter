class Player {
    constructor(x, y, c, m, speed) {
        this.id = Player.incrementId();
        this.pos = createVector(x, y);
        this.vel = createVector(speed, 0);
        this.acc = createVector(0, 0);
        this.mass = m;
        this.width = m;
        this.height = m;
        this.color = c;
        this.damping = 0.8
        this.floating = false
        this.rotateAngle = 0;
        this.jumping = false;
        this.landingFrame = 60;
        this.animationState = 'running';
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId++;
        return this.latestId;
    }

    getVel() {
        return this.vel;
    }

    getAcc() {
        return this.acc;
    }

    applyForce(f) {
        this.acc.add(f.copy().div(this.mass));
    }

    update() {
        var dampVel;
        this.vel.add(this.acc.copy());
        dampVel = this.vel.copy();
        dampVel.y *= this.damping;
        this.pos.add(dampVel);
        this.acc.set(0,0);
    }

    display() {
        noStroke();
        fill(this.color);
        rectMode(CENTER);
        push();
        if (this.floating) {
            translate(this.pos.x, this.pos.y);
            rotate(this.rotateAngle);
            translate(-this.pos.x, -this.pos.y);
        }
        if (this.id == 1) {
            //console.log(this.landingFrame)
        }
        var landingLength = 15;
        if (this.animationState == 'landing') {
            var shorterHalf = (this.mass/2 * (this.landingFrame/landingLength));
            this.height = this.mass/2 + shorterHalf;
            console.log(this.height)
            rect(this.pos.x, this.pos.y - shorterHalf, this.mass, this.mass/2 + shorterHalf);
            if (this.landingFrame < landingLength) {
                this.landingFrame++;
            } else {
                this.setAnimationState("running");
            }
        } else {
            rect(this.pos.x, this.pos.y, this.mass, this.mass);
        }


        pop();
        if (this.floating) {
            this.rotateAngle += 0.1;
        }
    }

    getMass() {
        return this.mass;
    }

    getPos() {
        return this.pos;
    }

    getId() {
        return this.id;
    }

    setSpeed(speed) {
        this.vel = createVector(speed, 0);
    }

    getSpeed() {
        return this.vel;
    }

    getFloating() {
        return this.floating;
    }

    setFloating(floating) {
        this.floating = floating;
    }

    setAnimationState(animationState) {
        this.animationState = animationState;
    }

    jump() {
        this.setAnimationState('floating');
    }

    detectEdges(bounce, playerNum) {
        if (this.pos.y + this.mass/2 + 1 >= (height/playerNum)*this.id) {
            // bottom
            this.pos.add(createVector(0, (height/playerNum)*this.id - (this.pos.y + this.mass/2)));
            this.vel.y *= -bounce;
            this.setFloating(false);
        } else
        if (this.pos.y - this.mass/2 <= (height/playerNum)*(this.id - 1)) {
            // top
            this.pos.add(createVector(0, (height/playerNum)*(this.id - 1) - (this.pos.y - this.mass/2)));
            this.vel.y *= -bounce;
            this.setFloating(false);
        } else {
            this.setFloating(true);
        }
    }

    detectCollisions(platforms) {
        platforms[this.id - 1].forEach((platform) => {
            // Check to see if it landed on a platform
            if ((this.pos.x < platform.getPos().x + platform.getWidth()) && (this.pos.x > platform.getPos().x)) {
                if (this.pos.y + this.mass/2 > platform.getSurface() && this.pos.y + this.mass/2 < platform.getBottomSurface()) {
                    if (this.vel.y > 0) {
                        this.pos.add(createVector(0, platform.getSurface() - (this.pos.y + this.height/2)));
                        this.vel.y *= 0;
                        if (this.animationState == 'floating') {
                            this.setAnimationState("landing");
                            this.landingFrame = 0;
                        }
                        this.setFloating(false);
                        this.rotateAngle = 0;
                    } else {
                        this.setFloating(true);
                        this.setAnimationState("floating");
                    }
                }
            }
        });
    }
}
