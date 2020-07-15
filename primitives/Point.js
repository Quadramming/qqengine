import {AXIS} from '../CONST/AXIS.js';

/** Class for simple point */
export class Point {
	
	#x;
	#y;
	
	/** Construct point
	* @param {number} [x=0] - The x value
	* @param {number} [y=x] - The y value
	* @example new Point(1, 2); // (1, 2)
	* new Point(NaN); // (NaN, NaN)
	* new Point(); // (0, 0)
	*/
	constructor(x = 0, y = x) {
		if ( x instanceof Array ) {
			y = x[1][0];
			x = x[0][0];
		}
		this.set(x, y)
	}
	
	/** Set x and y values
	* @param {number} [x=0] - The x value
	* @param {number} [y=x] - The y value
	* @return {Point} This
	*/
	set(x = 0, y = x) {
		this.x(x);
		this.y(y);
		return this;
	}
	
	/** Copy values from another Point
	* @param {Point} point - Source point
	* @return {Point} This
	*/
	copy(point) {
		if ( point instanceof Point ) {
			this.set(point.#x, point.#y);
		}
		return this;
	}
	
	copyOrSet(point, x, y) {
		if ( point instanceof Point ) {
			this.set(point.#x, point.#y);
		} else {
			this.set(x, y);
		}
		return this;
	}
	
	/** Clone Point
	@return {Point} New cloned Point
	**/
	clone() {
		return new Point(this.#x, this.#y);
	}
	
	/** Clone Point with oposite values (-x, -y)
	@return {Point} New cloned Point
	**/
	cloneOposite() {
		return new Point(-this.#x, -this.#y);
	}
	
	fixNaNToSimilar(point) {
		if ( this.getNaNAxis() === AXIS.XY ) {
			this.copy(point);
		} else if ( this.getNaNAxis() === AXIS.X ) {
			this.x( this.#y * point.getRatio() );
		} else if ( this.getNaNAxis() === AXIS.Y ) {
			this.y( this.#x / point.getRatio() );
		}
	}
	
	static subtraction(p1, p2) {
		return p1.clone().sub(p2);
	}
	
	static addition(p1, p2) {
		return p1.clone().add(p2);
	}
	
	static ZERO() {
		return new Point(0, 0);
	}
	
	//================================================================
	// Check functions
	//================================================================
	
	isZero() {
		return this.#x === 0 && this.#y === 0;
	}
	
	isEquals(point) {
		return (point.#x === this.#x) && (point.#y === this.#y);
	}
	
	isCorrect() {
		return ! this.hasNaN();
	}
	
	isNear(point, epsilon = 0) {
		if ( point.hasNaN() || this.hasNaN() ) {
			return false;
		}
		return Math.abs(point.#x - this.#x) <= epsilon
		    && Math.abs(point.#y - this.#y) <= epsilon;
	}
	
	hasNaN() {
		return Number.isNaN(this.#x) || Number.isNaN(this.#y);
	}
	
	isFilled() {
		return ! this.hasNaN();
	}
	
	oposite() {
		this.#x = -this.#x;
		this.#y = -this.#y;
		return this;
	}
	
	//================================================================
	// Get/set functions
	//================================================================
	
	getNaNAxis() {
		if ( Number.isNaN(this.#x) && Number.isNaN(this.#y) ) {
			return AXIS.XY;
		} else if ( Number.isNaN(this.#x) ) {
			return AXIS.X;
		} else if ( Number.isNaN(this.#y) ) {
			return AXIS.Y;
		}
		return AXIS.NONE;
	}
	
	getDistance(point) {
		const x = this.#x - point.#x;
		const y = this.#y - point.#y;
		return Math.sqrt( x*x + y*y );
	}
	
	getLength() {
		return Math.sqrt(this.#x ** 2 + this.#y ** 2);
	}
	
	getRatio() {
		return this.#x / this.#y;
	}
	
	x(value) {
		if ( value !== undefined ) {
			this.#check(value);
			this.#x = value;
		}
		return this.#x;
	}
	
	y(value) {
		if ( value !== undefined ) {
			this.#check(value);
			this.#y = value;
		}
		return this.#y;
	}
	
	//================================================================
	// Change functions
	//================================================================
	
	translate(point) {
		this.x(this.#x + point.#x);
		this.y(this.#y + point.#y);
		return this;
	}
	
	add(point) {
		return this.translate(point);
	}
	
	sub(point) {
		this.x(this.#x - point.#x);
		this.y(this.#y - point.#y);
		return this;
	}
	
	//================================================================
	// Debug
	//================================================================
	
	toString() {
		return '(' + this.#x + ', ' + this.#y + ')'
	}
	
	debug() {
		c(this.toString());
	}
	
	//================================================================
	// Private
	//================================================================
	
	#check(value) {
		if ( typeof value !== 'number' ) {
			throw new Error(`Has to be number`);
		}
	}
	
}
