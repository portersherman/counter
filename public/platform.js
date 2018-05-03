class Platform {
	constructor(x, y, w, h, c) {
		this.pos = createVector(x, y);
		this.width = w;
		this.height = h;
		this.color = c;
		this.created = millis();
		this.randDelay = w*10 + 50;
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

	display() {
		fill(this.color);
		noStroke();
		rectMode(CORNER);
		rect(this.pos.x, this.pos.y, this.width, this.height);
	}
}