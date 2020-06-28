import {Point} from './Point.js';

export class Anchor extends Point {
	
	cloneOposite() {
		return new Anchor(-this._x, -this._y);
	}
	
	clone() {
		return new Anchor(this._x, this._y);
	}
	
}
