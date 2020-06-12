import {AXIS} from './AXIS.js';

/** Class for simple point */
export class Point {
	
	/** Construct point
	* @param {number} [x=0] - The x value
	* @param {number} [y=x] - The y value
	* @example new Point(1, 2); // (1, 2)
	* new Point(NaN); // (NaN, NaN)
	* new Point(); // (0, 0)
	*/
	constructor(x = 0, y = x) {
		this._x = NaN;
		this._y = NaN;
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
		this.set(point._x, point._y);
		return this;
	}
	
	/** Clone Point
	@return {Point} New cloned Point
	**/
	clone() {
		return new Point(this._x, this._y);
	}
	
	/** Clone Point with oposite values (-x, -y)
	@return {Point} New cloned Point
	**/
	cloneOposite() {
		return new Point(-this._x, -this._y);
	}
	
	fixNaNToSimilar(point) {
		if ( this.getNaNAxis() === AXIS.XY ) {
			this.copy(point);
		} else if ( this.getNaNAxis() === AXIS.X ) {
			this.x( this._y * point.getRatio() );
		} else if ( this.getNaNAxis() === AXIS.Y ) {
			this.y( this._x / point.getRatio() );
		}
	}
	
	//================================================================
	// Check functions
	//================================================================
	
	isEquals(point) {
		return (point._x === this._x) && (point._y === this._y);
	}
	
	isCorrect() {
		return ! this.hasNaN();
	}
	
	isNear(point, epsilon = 0) {
		if ( point.hasNaN() || this.hasNaN() ) {
			return false;
		}
		return Math.abs(point._x - this._x) <= epsilon
		    && Math.abs(point._y - this._y) <= epsilon;
	}
	
	hasNaN() {
		return Number.isNaN(this._x) || Number.isNaN(this._y);
	}
	
	//================================================================
	// Get/set functions
	//================================================================
	
	getNaNAxis() {
		if ( Number.isNaN(this._x) && Number.isNaN(this._y) ) {
			return AXIS.XY;
		} else if ( Number.isNaN(this._x) ) {
			return AXIS.X;
		} else if ( Number.isNaN(this._y) ) {
			return AXIS.Y;
		}
		return AXIS.NONE;
	}
	
	getDistance(point) {
		const x = this._x - point._x;
		const y = this._y - point._y;
		return Math.sqrt( x*x + y*y );
	}
	
	getLength() {
		return Math.sqrt(this._x ** 2 + this._y ** 2);
	}
	
	getRatio() {
		return this._x / this._y;
	}
	
	x(value) {
		if ( value !== undefined ) {
			this._check(value);
			this._x = value;
		}
		return this._x;
	}
	
	y(value) {
		if ( value !== undefined ) {
			this._check(value);
			this._y = value;
		}
		return this._y;
	}
	
	//================================================================
	// Change functions
	//================================================================
	
	translate(point) {
		this.x(this._x + point._x);
		this.y(this._y + point._y);
		return this;
	}
	
	add(point) {
		return this.translate(point);
	}
	
	//================================================================
	// Debug
	//================================================================
	
	debug() {
		c('(' + this._x + ', ' + this._y + ')');
	}
	
	//================================================================
	// Private
	//================================================================
	
	_check(value) {
		if ( typeof value !== 'number' ) {
			throw new Error(`Has to be number`);
		}
	}
	
}
