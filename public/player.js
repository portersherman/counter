const RUNNING = 'state_running';
const FLOATING = 'state_floating';
const LANDING = 'state_landing';
const FALLING = 'state_falling';
const WAITING = 'state_waiting';

const PLAYER_SIZE = 20;

class Player {
    constructor(x, y, c, speed) {
        this.id = Player.incrementId();
        this.pos = createVector(x, y);
        this.vel = createVector(speed, 0);
        this.acc = createVector(0, 0);
        this.mass = PLAYER_SIZE;
        this.width = this.mass;
        this.height = this.mass;
        this.color = c;
        this.damping = 0.8
        this.animationFrame = 0;
        this.status = WAITING;
        this.score = 0;
        this.lives = 5;
        this.gameOver = false;
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        }
        else this.latestId++;
        return this.latestId;
    }

    restart() {
        this.score = 0;
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver = true;
        }
        this.pos.y = (height/this.constructor.latestId)*(this.id - 1) + 50;
        this.setAnimationState(WAITING);
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
        if (!this.isWaiting()) {
            this.vel.add(this.acc.copy());
        }
        dampVel = this.vel.copy();
        dampVel.y *= this.damping;
        this.pos.add(dampVel);
        this.acc.set(0,0);
    }

    display() {
        if (this.id == 1) {
          //console.log(this.status)
        }

        noStroke();
        fill(this.color);
        rectMode(CENTER);

        // push state to drawer
        push();

        if (this.isFloating()) {
            translate(this.pos.x, this.pos.y);
            rotate(this.animationFrame / 10);
            translate(-this.pos.x, -this.pos.y);
        }

        var landingLength = 10;
        switch(this.status) {
            case LANDING:
                var shorterHalf = (this.mass/2 * (this.animationFrame/(landingLength)));
                this.height = this.mass/2 + shorterHalf;
                rect(this.pos.x, this.pos.y - this.mass/2 + (this.mass/2 - shorterHalf)/2, this.mass, this.mass/2 + shorterHalf);
                if (this.animationFrame < landingLength) {
                    this.animationFrame++;
                } else {
                    this.setAnimationState(RUNNING);
                }
                break;
            case WAITING:
                if ((frameCount % 60) < 30) {
                    noFill()
                    stroke(this.color);
                    strokeWeight(2);
                } else {
                    fill(this.color);
                    noStroke();
                }
                rect(this.pos.x, this.pos.y, this.mass, this.mass);
                break;
            case RUNNING:
                rect(this.pos.x, this.pos.y - this.mass/2, this.mass, this.mass);
                break;
            default:
                rect(this.pos.x, this.pos.y, this.mass, this.mass);
                break;
        }

        pop();
        if (this.isFloating()) {
            this.animationFrame++;
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
      return this.status == FLOATING;
    }

    isRunning() {
      return this.status == RUNNING;
    }

    isLanding() {
      return this.status == LANDING;
    }

    isFalling() {
      return this.status == FALLING;
    }

    isWaiting() {
      return this.status == WAITING;
    }

    canJump() {
      return (
          this.isRunning() ||
          this.isLanding() ||
          this.isWaiting()
      );
    }

    canLand() {
        return (this.isFloating() || this.isFalling());
    }

    getAnimationState() {
        return this.status;
    }

    setAnimationState(status) {
        this.status = status;
    }

    jump() {
        this.setAnimationState(FLOATING);
        this.animationFrame = 0;
    }

    land() {
        this.setAnimationState(LANDING);
        this.animationFrame = 0;
    }

    detectEdges(bounce) {
        if (this.isWaiting()) {
            this.setAnimationState(WAITING);
        } else if (this.pos.y + this.mass/2 + 1 >= (height/this.constructor.latestId)*this.id) {
            // bottom
            this.pos.add(createVector(0, (height/this.constructor.latestId)*this.id - (this.pos.y + this.mass/2)));
            this.vel.y *= -bounce;
            this.restart();
        } else if (this.pos.y - this.mass/2 <= (height/this.constructor.latestId)*(this.id - 1)) {
            // top (don't bounce off the top, hide)
            // this.pos.add(createVector(0, (height/this.constructor.latestId)*(this.id - 1) - (this.pos.y - this.mass/2)));
            // this.vel.y *= -bounce;
        }
    }

    detectCollisions(platforms) {
        if (!this.isWaiting()) {
            var landed = false;
            platforms[this.id - 1].forEach((platform) => {
                // Check to see if it landed on a platform
                if (this.pos.y + this.mass/2 > platform.getSurface() && this.pos.y + this.mass/2 < platform.getBottomSurface()) {
                    if ((this.pos.x - this.mass/2 < platform.getPos().x + platform.getWidth()) && (this.pos.x + this.mass/2 > platform.getPos().x)) {
                        if (this.vel.y > 0) {
                            landed = true;
                            this.pos.add(createVector(0, platform.getSurface() - (this.pos.y)));
                            this.vel.y *= 0;
                            if (this.canLand()) {
                                this.score++;
                                this.land();
                                //console.log(this.id + ": " + this.score);
                            }
                        }
                    }
                }
            });
            if (this.isRunning() && !landed) {
                console.log('ouch!')
                this.setAnimationState(FALLING);
            }
        }
    }
}
