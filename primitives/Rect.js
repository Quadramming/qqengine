// QQDOC

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
	} // new Rect
	
	//================================================================
	// Copy functions
	//================================================================
	
	clone() {
		return new Rect(this._x, this._y, this._width, this._height);
	} // new Rect
	
	copy(rectangle) {
		this._x = rectangle._x;
		this._y = rectangle._y;
		this._width = rectangle._width;
		this._height = rectangle._height;
		return this;
	} // this
	
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
	} // boolean
	
	isIntersect(rect) {
		if ( this.bottom() <= rect.top() || this.top() >= rect.bottom() ) {
			return false;
		}
		if ( this.right() <= rect.left() || this.left() >= rect.right() ) {
			return false;
		}
		return true;
	} // boolean
	
	intersectValue(rect) {
		if ( ! this.isIntersect(rect) ) {
			return false;
		}
		const value = Point.ZERO();
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
	} // new Point
	
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
	} // new Point
	
	//================================================================
	// Get
	//================================================================
	
	set(x, y, width, height) {
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	} // void
	
	x(x) { // {F}
		if ( x !== undefined ) {
			this._x = x;
		}
		return this._x;
	} // number
	
	y(y) { // {F}
		if ( y !== undefined ) {
			this._y = y;
		}
		return this._y;
	} // number
	
	width(width) { // {F}
		if ( width !== undefined ) {
			this._width = width;
		}
		return this._width;
	} // number
	
	height(height) { // {F}
		if ( height !== undefined ) {
			this._height = height;
		}
		return this._height;
	} // number
	
	w(w) { // {F}
		return this.width(w);
	} // number
	
	h(h) { // {F}
		return this.height(h);
	} // number
	
	left() {
		return this._x;
	} // number
	
	right() {
		return this._x + this._width;
	} // number
	
	top() {
		return this._y;
	} // number
	
	bottom() {
		return this._y + this._height;
	} // number
	
	size() {
		return new Size(this._width, this._height);
	} // new Size
	
	center() {
		return new Point(this._x + this._width/2, this._y + this._height/2);
	} // new Point
	
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
	} // void
	
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
	} // void
	
}
