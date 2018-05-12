const RUNNING = 'state_running';
const FLOATING = 'state_floating';
const LANDING = 'state_landing';
const FALLING = 'state_falling'

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
        this.reset = true;
        this.damping = 0.8
        this.floating = false
        this.rotateAngle = 0;
        this.jumping = false;
        this.landingFrame = 60;
        this.animationState = RUNNING;
        this.score = 0;
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        }
        else this.latestId++;
        return this.latestId;
    }

    start() {
        this.reset = false;
        this.score = 0;
    }

    restart() {
        this.reset = true;
        this.pos.y = (height/this.constructor.latestId)*(this.id - 1) + (height/this.constructor.latestId) / 3;
        this.setAnimationState(RUNNING);
    }

    getScore() {
        return this.score;
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
        if (!this.reset) {
            this.vel.add(this.acc.copy());
        }
        dampVel = this.vel.copy();
        dampVel.y *= this.damping;
        this.pos.add(dampVel);
        this.acc.set(0,0);
    }

    display() {
        if (this.id == 1) {
          //console.log(this.animationState)
        }

        noStroke();
        fill(this.color);
        rectMode(CENTER);
        push();
        if (this.isFloating()) {
            translate(this.pos.x, this.pos.y);
            rotate(this.rotateAngle);
            translate(-this.pos.x, -this.pos.y);
        }
        if (this.id == 1) {
            //console.log(this.landingFrame)
        }
        var landingLength = 10;
        if (this.animationState == LANDING) {
            var shorterHalf = (this.mass/2 * (this.landingFrame/landingLength));
            this.height = this.mass/2 + shorterHalf;
            rect(this.pos.x, this.pos.y + (this.mass/2 - shorterHalf)/2, this.mass, this.mass/2 + shorterHalf);
            if (this.landingFrame < landingLength) {
                this.landingFrame++;
            } else {
                this.setAnimationState(RUNNING);
            }
        } else {
            rect(this.pos.x, this.pos.y, this.mass, this.mass);
        }


        pop();
        if (this.isFloating()) {
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

    isFloating() {
      return this.animationState == FLOATING;
    }

    isRunning() {
      return this.animationState == RUNNING;
    }

    isLanding() {
      return this.animationState == LANDING;
    }

    canJump() {
      return (this.animationState == RUNNING || this.animationState == LANDING);
    }

    getAnimationState() {
        return this.animationState;
    }

    setAnimationState(animationState) {
        this.animationState = animationState;
    }

    jump() {
        this.setAnimationState(FLOATING);
        this.rotateAngle = 0;
    }

    land() {
        this.setAnimationState(LANDING);
        this.landingFrame = 0;
    }

    detectEdges(bounce) {
        if (this.reset) {
            this.setAnimationState(RUNNING);
        } else if (this.pos.y + this.mass/2 + 1 >= (height/this.constructor.latestId)*this.id) {
            // bottom
            this.pos.add(createVector(0, (height/this.constructor.latestId)*this.id - (this.pos.y + this.mass/2)));
            this.vel.y *= -bounce;
            this.restart();
        } else if (this.pos.y - this.mass/2 <= (height/this.constructor.latestId)*(this.id - 1)) {
            // top
            this.pos.add(createVector(0, (height/this.constructor.latestId)*(this.id - 1) - (this.pos.y - this.mass/2)));
            this.vel.y *= -bounce;
        }
    }

    detectCollisions(platforms) {
        if (this.reset) {
            this.setAnimationState(RUNNING);
        } else {
            platforms[this.id - 1].forEach((platform) => {
                // Check to see if it landed on a platform
                if (this.pos.y + this.mass/2 > platform.getSurface() && this.pos.y + this.mass/2 < platform.getBottomSurface()) {
                    if ((this.pos.x - this.mass/2 < platform.getPos().x + platform.getWidth()) && (this.pos.x + this.mass/2 > platform.getPos().x)) {
                        if (this.vel.y > 0) {
                            this.pos.add(createVector(0, platform.getSurface() - (this.pos.y + this.height/2)));
                            this.vel.y *= 0;
                            if (this.isFloating()) {
                                this.score++;
                                this.land();
                            }
                            this.rotateAngle = 0;
                        }
                    } else if (this.isRunning()) {
                        console.log('fell')
                        this.setAnimationState(FALLING);
                    }
                }
            });
        }
    }
}
