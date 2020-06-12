import {Point} from './Point.js';

/** Size class **/
export class Size extends Point {
	
	cloneOposite() {
		return new Size(-this._x, -this._y);
	}
	
	clone() {
		return new Size(this._x, this._y);
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
	
}
