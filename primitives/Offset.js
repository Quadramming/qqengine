import {Point} from './Point.js';

/** Size class **/
export class Offset extends Point {
	
	cloneOposite() {
		return new Offset(-this._x, -this._y);
	}
	
	clone() {
		return new Offset(this._x, this._y);
	}
	
}
