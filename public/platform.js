class Platform {
	constructor(x, y, w, h, c, speed) {
		this.pos = createVector(x, y);
		this.width = w;
		this.height = h;
		this.color = c;
		this.created = frameCount;
		this.randDelay = w / speed + 30;
		debugger;
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
		fill(this.color);
		noStroke();
		rectMode(CORNER);
		rect(this.pos.x, this.pos.y, this.width, this.height);
	}
}
