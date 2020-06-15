import {Point} from './Point.js';
import {Size} from './Size.js';

export class Rect {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}
	
	static fromPoints(...points) {
		const left = Math.min( ...points.map( (point)=>point.x() ));
		const top = Math.min( ...points.map( (point)=>point.y() ));
		const right = Math.max( ...points.map( (point)=>point.x() ));
		const bottom = Math.max( ...points.map( (point)=>point.y() ));
		return new Rect(left, top, right-left, bottom-top);
	}
	
	//================================================================
	// Copy functions
	//================================================================
	
	clone() {
		return new Rect(this._x, this._y, this._width, this._height);
	}
	
	copy(rectangle) {
		this._x = rectangle._x;
		this._y = rectangle._y;
		this._width = rectangle._width;
		this._height = rectangle._height;
		return this;
	}
	
	//================================================================
	// Checks
	//================================================================
	
	isContains(point) {
		let x = point.x();
		let y = point.y();
		if ( this._width <= 0 || this._height <= 0 ) {
			return false;
		}
		if ( this._x <= x && x < this._x + this._width ) {
			if ( this._y <= y && y < this._y + this._height ) {
				return true;
			}
		}
		return false;
	}
	
	isIntersect(rect) {
		if ( this.bottom() < rect.top() || this.top() > rect.bottom() ) {
			return false;
		}
		if ( this.right() < rect.left() || this.left() > rect.right() ) {
			return false;
		}
		return true;
	}
	
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
	
	size() {
		return new Size(this._width, this._height);
	}
	
	center() {
		return new Point(this._x+this._width/2, this._y+this._height/2);
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
	
}
