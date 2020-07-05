import {Point} from './Point.js';
import {Size} from './Size.js';
import * as maths from '../maths.js';

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
		const left = Math.min( ...points.map( point => point.x() ));
		const top = Math.min( ...points.map( point => point.y() ));
		const right = Math.max( ...points.map( point => point.x() ));
		const bottom = Math.max( ...points.map( point => point.y() ));
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
		if ( this.bottom() <= rect.top() || this.top() >= rect.bottom() ) {
			return false;
		}
		if ( this.right() <= rect.left() || this.left() >= rect.right() ) {
			return false;
		}
		return true;
	}
	
	intersectValue(rect) {
		if ( ! this.isIntersect(rect) ) {
			return false;
		}
		const value = new Point(0, 0);
		let x1 = this.right() - rect.left();
		let x2 = this.left() - rect.right();
		if ( maths.getSign(x1) !== maths.getSign(x2) ) {
			value.x(maths.absMin(x1, x2));
		}
		let y1 = this.top() - rect.bottom();
		let y2 = this.bottom() - rect.top();
		if ( maths.getSign(y1) !== maths.getSign(y2) ) {
			value.y(maths.absMin(y1, y2));
		}
		return value;
	}
	
	intersectResolve(rect) {
		const value = this.intersectValue(rect);
		if ( value ) {
			if ( Math.abs(value.x()) < Math.abs(value.y()) ) {
				value.y(0);
			} else {
				value.x(0);
			}
		}
		return value;
	}
	
	//================================================================
	// Get
	//================================================================
	
	set(x, y, width, height) {
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}
	
	x(x) {
		if ( x !== undefined ) {
			this._x = x;
		}
		return this._x;
	}
	
	y(y) {
		if ( y !== undefined ) {
			this._y = y;
		}
		return this._y;
	}
	
	width(width) {
		if ( width !== undefined ) {
			this._width = width;
		}
		return this._width;
	}
	
	height(height) {
		if ( height !== undefined ) {
			this._height = height;
		}
		return this._height;
	}
	
	w(w) {
		return this.width(w);
	}
	
	h(h) {
		return this.height(h);
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
	
	size() {
		return new Size(this._width, this._height);
	}
	
	center() {
		return new Point(this._x + this._width/2, this._y + this._height/2);
	}
	
	enclose(point) {
		if ( point.x() > this.right() ) {
			point.x( this.right() );
		} else if ( point.x() < this.left() ) {
			point.x( this.left() );
		}
		if ( point.y() < this.top() ) {
			point.y( this.top() );
		} else if ( point.y() > this.bottom() ) {
			point.y( this.bottom() );
		}
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
