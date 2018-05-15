const RUNNING = 'state_running';
const FLOATING = 'state_floating';
const LANDING = 'state_landing';
const FALLING = 'state_falling';
const WAITING = 'state_waiting';

const MAJPENT = "major_pentatonic_scale";
const MINPENT = "minor_pentatonic_scale";

const PLAYER_SIZE = 20;

const SCALES = {"major_pentatonic_scale" : [0, 2, 4, 7, 9],
                "minor_pentatonic_scale" : [0, 3, 5, 7, 10]};

const BASE_PITCH = 60;

const filter = new p5.LowPass(1000);
const backFilter = new p5.LowPass(1000);

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
        this.damping = 0.8;
        this.lastLand = Number.NEGATIVE_INFINITY;
        this.animationFrame = 0;
        this.status = WAITING;
        this.class = MAJPENT;
        this.setupSound();
        this.trail = new ParticleSystem(5, this.pos.x, this.pos.y, 40);
        this.displayParticles = false;
    }

    setupSound() {
        this.env = new p5.Env();
        this.env.setADSR(0.125, 0.125, 0.2, 0.75);
        this.env.setRange(0.3, 0);

        this.osc = new p5.Oscillator();
        this.osc.setType('sawtooth');
        this.osc.freq(0);
        this.osc.amp(this.env);
        this.osc.pan((this.id - 1.5)*1.66);
        this.osc.disconnect();
        this.osc.connect(filter);
        this.osc.start();

        this.lOsc = new p5.Oscillator();
        this.lOsc.setType('sawtooth');
        this.lOsc.freq(0);
        this.lOsc.amp(this.env);
        this.lOsc.pan((this.id - 1.5)*2);
        this.lOsc.disconnect();
        this.lOsc.connect(filter);
        this.lOsc.start();

        this.hOsc = new p5.Oscillator();
        this.hOsc.setType('sawtooth');
        this.hOsc.freq(0);
        this.hOsc.amp(this.env);
        this.hOsc.pan((this.id - 1.5)*2);
        this.hOsc.disconnect();
        this.hOsc.connect(filter);
        this.hOsc.start();

        this.subOsc = new p5.Oscillator();
        this.subOsc.setType('sine');
        this.subOsc.freq(0);
        this.subOsc.amp(this.env);
        this.subOsc.pan((this.id - 1.5)*1.66);
        this.subOsc.disconnect();
        this.subOsc.connect(filter);
        this.subOsc.start();
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        }
        else this.latestId++;
        return this.latestId;
    }

    setColor(color) {
        this.color = color;
    }

    static setFilterFreq(frequency1, frequency2) {
        // console.log("change filter");
        filter.freq(frequency1);
        backFilter.freq(frequency2);
    }

    restart() {
        this.pos.y = (height / this.constructor.latestId) * (this.id - 1) + height / (2 * this.constructor.latestId);
        this.setAnimationState(WAITING);
    }

    getVel() {
        return this.vel;
    }

    getAcc() {
        return this.acc;
    }

    getLastLand() {
        return this.lastLand;
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

    makeTrail() {
        if (this.displayParticles) {
            var vel = this.vel.copy();
            vel.y *= 0;
            vel.y -= (Math.random()*1.5);
            if (frameCount % 2 == 0) {
                this.trail.pushParticles(4, this.pos.x - this.mass/2, this.pos.y, vel, false);
            }
        }
    }

    drawTrail() {
        if (this.displayParticles) {
            this.trail.update();
            this.trail.display(this.canLand());
        }
    }

    toggleParticles() {
        this.displayParticles = !this.displayParticles;
    }

    display() {
        if (this.id == 1) {
          // console.log(this.status)
        }

        // noStroke();
        // fill(this.color);
        // stroke(this.color);
        // strokeWeight(3);
        fill(this.color);
        rectMode(CENTER);

        // push state to drawer
        push();

        if (this.isFloating()) {
            translate(this.pos.x, this.pos.y);
            rotate(this.animationFrame / 10);
            scale(1 + clamp(Math.abs(jumpVel) - Math.abs(this.vel.y), Math.abs(jumpVel), 0) / 40);
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
                this.makeTrail();
                break;
            case WAITING:
                if ((frameCount % 60) < 30) {
                    noFill()
                    stroke(this.color);
                    strokeWeight(3);
                } else {
                    fill(this.color);
                    noStroke();
                }
                rect(this.pos.x, this.pos.y, this.mass, this.mass);
                break;
            case RUNNING:
                rect(this.pos.x, this.pos.y - this.mass/2, this.mass, this.mass);
                this.makeTrail();
                break;
            case FALLING:
                rect(this.pos.x, this.pos.y - this.mass/2, this.mass, this.mass);
                break;
            default:
                rect(this.pos.x, this.pos.y, this.mass, this.mass);
                break;
        }
        pop();

        this.drawTrail();

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
        this.noteOff();
    }

    land(platform) {
        this.setAnimationState(LANDING);
        this.animationFrame = 0;
        this.lastLand = frameCount;
        var freq = this.calculateFrequency(platform.pos.y);
        this.noteOn(freq);
    }

    fall() {
        this.setAnimationState(FALLING);
        this.animationFrame = 0;
        this.noteOff();
    }

    noteOn(f) {
        this.osc.freq(f);
        this.lOsc.freq(f+1.5);
        this.lOsc.freq(f-1.5);
        this.subOsc.freq(f/2);
        this.env.triggerAttack();
    }

    noteOff() {
        this.env.triggerRelease();
    }


    detectEdges(bounce) {
        if (this.isWaiting()) {
            this.setAnimationState(WAITING);
        } else if (this.pos.y + this.mass/2 + 1 >= (height/this.constructor.latestId)*this.id) {
            // bottom
            this.pos.add(createVector(0, (height/this.constructor.latestId)*this.id - (this.pos.y + this.mass/2)));
            this.vel.y *= -bounce;
            this.trail.deathExplosion(this.pos);
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
            Object.keys(platforms[this.id - 1]).forEach((k) => {
                platforms[this.id - 1][k].forEach((platform) => {
                    // Check to see if it landed on a platform
                    if (this.pos.y + this.mass/2 > platform.getSurface() && this.pos.y + this.mass/2 < platform.getBottomSurface()) {
                        if ((this.pos.x - this.mass/2 < platform.getPos().x + platform.getWidth()) && (this.pos.x + this.mass/2 > platform.getPos().x)) {
                            if (this.vel.y > 0) {
                                landed = true;
                                platform.setActivated();
                                this.pos.add(createVector(0, platform.getSurface() - (this.pos.y)));
                                this.vel.y *= 0;
                                if (this.canLand()) {
                                    this.land(platform);
                                }
                            }
                        }
                    }
                });
            });
            if (this.isRunning() && !landed) {
                // console.log('ouch!')
                this.fall();
            }
        }
    }

    calculateFrequency(y) {
        var laneHeight = height / 2;
        y = Math.floor(y) % laneHeight;
        y = laneHeight - y;

        var steps = Math.floor(laneHeight / PLATFORM_HEIGHT);
        var note = Math.floor(y / laneHeight * steps);

        // Base note + Octave + Degree
        var pitch = BASE_PITCH + (Math.floor(note / SCALES[this.class].length) * 12) + (SCALES[this.class][note % SCALES[this.class].length]);
        return midiToFreq(pitch);
    }

    switchClass() {
        this.class = (this.class == MAJPENT) ? MINPENT : MAJPENT;
    }
}
