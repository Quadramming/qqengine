QQ.Point = class Point {
	
	constructor(x = 0, y = x) {
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
	
	isCorrect() {
		return ! this.isNaN();
	}
	
	isNear(point, epsilon) {
		if ( point.isNaN() || this.isNaN() ) {
			return false;
		}
		return Math.abs(point.x() - this.x()) < epsilon &&
			   Math.abs(point.y() - this.y()) < epsilon;
	}
	
	isNaN() {
		return Number.isNaN(this._x) || Number.isNaN(this._y);
	}
	
	set(x, y = x) {
		this._x = QQ.default(x, 0);
		this._y = QQ.default(y, 0);
	}
	
	setX(value) {
		this.x(value);
	}
	
	setY(value) {
		this.y(value);
	}
	
	w(value) {
		return this.x(value);
	}
	
	h(value) {
		return this.y(value);
	}
	
	x(value) {
		if ( value !== undefined ) {
			this._x = value;
		} else {
			return this._x;
		}
	}
	
	y(value) {
		if ( value !== undefined ) {
			this._y = value;
		} else {
			return this._y;
		}
	}
	
	debug() {
		c('Point: (' + this._x + ', '+this._y+')');
	}
	
};
