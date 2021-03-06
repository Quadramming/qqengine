// QQDOC

import * as maths from '../maths.js';
import {Point} from './Point.js';
import {Size} from './Size.js';

export class Rect {
	
	#x;
	#y;
	#width;
	#height;
	
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.#x = x;
		this.#y = y;
		this.#width = width;
		this.#height = height;
	}
	
	static fromPoints(...points) {
		const left = Math.min( ...points.map( point => point.x() ));
		const top = Math.min( ...points.map( point => point.y() ));
		const right = Math.max( ...points.map( point => point.x() ));
		const bottom = Math.max( ...points.map( point => point.y() ));
		return new Rect(left, top, right-left, bottom-top);
	} // new Rect
	
	clone() {
		return new Rect(this.#x, this.#y, this.#width, this.#height);
	} // new Rect
	
	copy(rectangle) {
		this.#x = rectangle.#x;
		this.#y = rectangle.#y;
		this.#width = rectangle.#width;
		this.#height = rectangle.#height;
		return this;
	} // this
	
	isContains(point) {
		let x = point.x();
		let y = point.y();
		if ( this.#width <= 0 || this.#height <= 0 ) {
			return false;
		}
		if ( this.#x <= x && x < this.#x + this.#width ) {
			if ( this.#y <= y && y < this.#y + this.#height ) {
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
	} // new Point | boolean
	
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
	
	set(x, y, width, height) {
		this.#x = x;
		this.#y = y;
		this.#width = width;
		this.#height = height;
	} // void
	
	x(x) { // {F}
		if ( x !== undefined ) {
			this.#x = x;
		}
		return this.#x;
	} // number
	
	y(y) { // {F}
		if ( y !== undefined ) {
			this.#y = y;
		}
		return this.#y;
	} // number
	
	width(width) { // {F}
		if ( width !== undefined ) {
			this.#width = width;
		}
		return this.#width;
	} // number
	
	height(height) { // {F}
		if ( height !== undefined ) {
			this.#height = height;
		}
		return this.#height;
	} // number
	
	w(w) { // {F}
		return this.width(w);
	} // number
	
	h(h) { // {F}
		return this.height(h);
	} // number
	
	left() {
		return this.#x;
	} // number
	
	right() {
		return this.#x + this.#width;
	} // number
	
	top() {
		return this.#y;
	} // number
	
	bottom() {
		return this.#y + this.#height;
	} // number
	
	size() {
		return new Size(this.#width, this.#height);
	} // new Size
	
	center() {
		return new Point(this.#x + this.#width/2, this.#y + this.#height/2);
	} // new Point
	
	enclose(point) { // Clamp
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
	
	debug() {
		c('Rect: (');
		c('x: ' + this.#x);
		c('y: ' + this.#y);
		c('width: ' + this.#width);
		c('height: ' + this.#height);
		c(')');
	} // void
	
}
