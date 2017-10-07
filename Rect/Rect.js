QQ.Rect = class Rect {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this._x      = x;
		this._y      = y;
		this._width  = width;
		this._height = height;
	}
	
	//================================================================
	// Copy functions
	//================================================================
	
	clone() {
		return new Rectangle(this._x, this._y, this._width, this._height);
	}
	
	copy(rectangle) {
		this._x      = rectangle.x();
		this._y      = rectangle.y();
		this._width  = rectangle.width();
		this._height = rectangle.height();
		return this;
	}
	
	//================================================================
	// Checks
	//================================================================
	
	isContains(x, y) { // (Point) or (x, y)
		if ( x instanceof QQ.Point) {
			y = x.y();
			x = x.x();
		}
		if ( this._width <= 0 || this._height <= 0 ) {
			return false;
		}
		if ( this._x <= x && x < this._x + this._width ) {
			if ( this._y <= y  && y < this._y + this._height ) {
				return true;
			}
		}
		return false;
	}
	
	isIntersect(box) {
		if ( this.top() < box.bottom() || this.bottom() > box.top() ) {
			return false;
		}
		if ( this.right() < box.left() || this.left() > box.right() ) {
			return false;
		}
		return true;
	};
	
	//================================================================
	// Get
	//================================================================
	
	x() {
		return this._x;
	}
	
	y() {
		return this._y;
	}
	
	left() {
		return this._x;
	}
	
	right() {
		return this._x + this._width;
	}
	
	top() {
		return this._y;
	}
	
	bottom() {
		return this._y + this._height;
	}
	
	width() {
		return this._width;
	}
	
	height() {
		return this._height;
	}
	
	w() {
		return this._width;
	}
	
	h() {
		return this._height;
	}
	
	//================================================================
	// Debug
	//================================================================
	
	debug() {
		c('Rect: (');
		c('x: ' + this._x);
		c('y: ' + this._y);
		c('width: ' + this._width);
		c('height: ' + this._height);
		c(')');
	}
	
};
