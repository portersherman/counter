class Platform {
	constructor(x, y, w, h, c, speed) {
		this.id = Platform.incrementId();
		this.pos = createVector(x, y);
		this.width = w;
		this.height = h;
		this.color = c;
		this.created = frameCount;
		this.activated = false;
		this.randDelay = w / speed + 30;
	}

	static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        }
        else this.latestId++;
        return this.latestId;
    }

	changeColor(color) {
        this.color = color;
    }

	setActivated() {
		this.activated = true;
	}

	getTimeCreated() {
		return this.created;
	}

	getRandDelay() {
		return this.randDelay;
	}

	getSurface() {
		return this.pos.y;
	}

	getBottomSurface() {
		return this.pos.y + this.height;
	}

	getRightSurface() {
		return this.pos.x + this.width;
	}

	getWidth() {
		return this.width;
	}

	getPos() {
		return this.pos;
	}

	display() {
		// fill(this.color);
		// stroke(255);
		// strokeWeight(3);
		stroke(this.color);
		strokeWeight(3);
		noFill();
		rectMode(CORNER);
		rect(this.pos.x, this.pos.y, this.width, this.height);

		if (this.activated) {
			noStroke()
			fill(this.color);
			rectMode(CORNER);
			rect(this.pos.x, this.pos.y, this.width, this.height);
		}
	}
}
