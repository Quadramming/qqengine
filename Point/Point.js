QQ.Point = class Point {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(x = 0, y = x) {
		this._x = x;
		this._y = y;
	}
	
	//================================================================
	// Set value functions
	//================================================================
	
	cloneOposite() {
		return new Point(-this._x, -this._y);
	}
	
	clone() {
		return new Point(this._x, this._y);
	}
	
	copy(point) {
		this.set(point.x(), point.y());
	}
	
	set(x, y = x) {
		this._x = QQ.default(x, 0);
		this._y = QQ.default(y, 0);
	}
	
	//================================================================
	// Check functions
	//================================================================
	
	isEquals(point) {
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
	
	//================================================================
	// Get/set functions
	//================================================================

	getDistance(point) {
		const a = this._x - point.x();
		const b = this._y - point.y();
		return Math.sqrt( a*a + b*b );
	}
	
	getLength() {
		return Math.sqrt(this._x*this._x + this._y*this._y);
	}
	
	getRatio() {
		return this._x / this._y;
	}
	
	width(value) {
		return this.x(value);
	}
	
	height(value) {
		return this.y(value);
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
	
	//================================================================
	// Change functions
	//================================================================
	
	translate(point) {
		this._x += point.x();
		this._y += point.y();
	}
	
	add(point) {
		this.translate(point);
	}
	
	//================================================================
	// Debug
	//================================================================
	
	debug() {
		c('Point: (' + this._x + ', '+this._y+')');
	}
	
};
