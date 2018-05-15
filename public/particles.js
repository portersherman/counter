class Particle {
    constructor(x, y, vel, ttl, isDeathExplosionParticle, deathSound) {
        this.pos = createVector(x, y);
        this.pos.x += (random() - 0.5) * PLAYER_SIZE;
        // this.pos.x -= PLAYER_SIZE;
        this.vel = vel;
        this.damping = 0.8;
        this.deathSound = deathSound;

        this.isDeathExplosionParticle = isDeathExplosionParticle;

        this.ttl = ttl + (random() - 0.5 ) * 20;
    }

    update(dampY) {
        this.pos.add(this.vel);

        this.vel.x *= this.damping;
        if (dampY || this.isDeathExplosionParticle) {
            this.vel.y *= this.damping;
        }
        this.ttl -= 1;
    }

    display() {
        push();
        var size;
        if (this.isDeathExplosionParticle) {
            noStroke();
            size = (Math.random() - 0.5) * 10 + 10;
        } else {
            noStroke();
            size = (Math.random() - 0.5) * 5 + 10;
        }
        rect(this.pos.x, this.pos.y, size, size);
        pop();
    }

    isAlive() {
        return (this.ttl > 0);
    }


}

class ParticleSystem {
    constructor(numParticles, x, y, ttl) {
        this.particles = [];
        this.basePos = createVector(x, y);
        this.baseVel = createVector(0, 0);
        this.ttl = ttl;
    }

    getNumParticles() {
        return this.particles.length
    }

    pushParticles(num, x, y, vel, isDying) {
        for (var i = 0; i < num; i++) {
            this.particles.push(new Particle(x-PLAYER_SIZE/2, y, vel, this.ttl, isDying))
        }
    }

    deathExplosion(pos) {
        var theta;
        var r;
        var vel;
        for (var i = 0; i < 60; i++) {
            theta = -(random() * Math.PI)
            r = random() * 30;
            vel = createVector(r * Math.cos(theta), r * Math.sin(theta))
            this.particles.push(new Particle(pos.x, pos.y, vel, 60, true));

        }

    }

    update() {
        var len = this.getNumParticles();
        for (var i = len-1; i >=0; i--) {
            var particle = this.particles[i];
            particle.update();
            particle.display();
            if ((!particle.isAlive()) ||
                (particle.isDeathExplosionParticle && particle.vel.magSq() < 0.125)
            ) {
                this.particles.splice(i,1);
            }
        }
    }

    display(dampY) {
        this.particles.forEach((p) => {
            p.update(dampY);
            p.display();
        })
    }
}
