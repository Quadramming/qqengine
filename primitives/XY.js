// QQDOC

import {AXIS} from '../CONST/AXIS.js';

export class XY {
	
	#x; // X value
	#y; // Y value
	
	constructor(x = 0, y = x) { // x can be vector
		if ( x instanceof Array ) {
			y = x[1][0];
			x = x[0][0];
		}
		this.set(x, y)
	}
	
	static ZERO() {
		return new XY(0, 0);
	} // new XY
	
	static addition(xy1, xy2) {
		return xy1.clone().add(xy2);
	} // new XY
	
	static subtraction(xy1, xy2) {
		return xy1.clone().sub(xy2);
	} // new XY
	
	set(x = 0, y = x) {
		this.x(x);
		this.y(y);
		return this;
	} // this
	
	copy(xy) {
		if ( xy instanceof XY ) {
			this.set(xy.#x, xy.#y);
		}
		return this;
	} // this
	
	copyOrSet(xy, x, y) {
		if ( xy instanceof XY ) {
			this.set(xy.#x, xy.#y);
		} else {
			this.set(x, y);
		}
		return this;
	} // this
	
	clone() {
		return new XY(this.#x, this.#y);
	} // new XY
	
	cloneOposite() {
		return new XY(-this.#x, -this.#y);
	} // new XY
	
	fixNaNToSimilar(xy) {
		if ( this.getNaNAxis() === AXIS.XY ) {
			this.copy(xy);
		} else if ( this.getNaNAxis() === AXIS.X ) {
			this.x( this.#y * xy.getRatio() );
		} else if ( this.getNaNAxis() === AXIS.Y ) {
			this.y( this.#x / xy.getRatio() );
		}
	} // void
	
	isZero() {
		return this.#x === 0 && this.#y === 0;
	} // boolean
	
	isEquals(xy) {
		return (xy.#x === this.#x) && (xy.#y === this.#y);
	} // boolean
	
	isCorrect() { // Has no NaN
		return ! this.hasNaN();
	} // boolean
	
	isNear(xy, epsilon = 0) {
		if ( xy.hasNaN() || this.hasNaN() ) {
			return false;
		}
		return Math.abs(xy.#x - this.#x) <= epsilon
		    && Math.abs(xy.#y - this.#y) <= epsilon;
	} // boolean
	
	hasNaN() {
		return Number.isNaN(this.#x) || Number.isNaN(this.#y);
	} // boolean
	
	isFilled() { // Has no NaN
		return this.isCorrect();
	} // boolean
	
	oposite() {
		this.#x = -this.#x;
		this.#y = -this.#y;
		return this;
	} // this
	
	getNaNAxis() {
		if ( Number.isNaN(this.#x) && Number.isNaN(this.#y) ) {
			return AXIS.XY;
		} else if ( Number.isNaN(this.#x) ) {
			return AXIS.X;
		} else if ( Number.isNaN(this.#y) ) {
			return AXIS.Y;
		}
		return AXIS.NONE;
	} // AXIS
	
	getDistance(xy) {
		const x = this.#x - xy.#x;
		const y = this.#y - xy.#y;
		return Math.sqrt( x*x + y*y );
	} // number
	
	getLength() {
		return Math.sqrt(this.#x ** 2 + this.#y ** 2);
	} // number
	
	getRatio() {
		return this.#x / this.#y;
	} // number
	
	x(value) { // {F}
		if ( value !== undefined ) {
			this.#check(value);
			this.#x = value;
		}
		return this.#x;
	} // number
	
	y(value) { // {F}
		if ( value !== undefined ) {
			this.#check(value);
			this.#y = value;
		}
		return this.#y;
	} // number
	
	translate(xy) {
		this.x(this.#x + xy.#x);
		this.y(this.#y + xy.#y);
		return this;
	} // this
	
	add(xy) {
		return this.translate(xy);
	} // this
	
	sub(xy) {
		this.x(this.#x - xy.#x);
		this.y(this.#y - xy.#y);
		return this;
	} // this
	
	toString() {
		return '(' + this.#x + ', ' + this.#y + ')'
	} // string
	
	debug() { // console log
		c(this.toString());
	} // void
	
	#check(value) { // Check if value number
		if ( typeof value !== 'number' ) {
			throw new Error(`Has to be number`);
		}
	} // void
	
}
