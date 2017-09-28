QQ.Point = class Point {
	
	constructor(x = 0, y = 0) {
		this._x = x;
		this._y = y;
	}
	
	
	clone() {
		return new Point(this._x, this._y);
	}

	copy(point) {
		this.set(point.x(), point.y());
	}
	
	equals(point) {
		return (point.x() === this._x) && (point.y() === this._y);
	}
	
	set(x, y = x) {
		this._x = QQ.default(x, 0);
		this._y = QQ.default(y, 0);
	}
	
	setX(x) {
		this._x = x;
	}
	
	setY(y) {
		this._y = y;
	}
	
	x() {
		return this._x;
	}
	
	y() {
		return this._y;
	}
	
	debug() {
		c('Point: (' + this._x + ', '+this._y+')');
	}
	
};
