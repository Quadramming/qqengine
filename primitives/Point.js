// QQDOCS

import {XY} from './XY.js';

export class Point extends XY {
	
	cloneOposite() {
		return new Point(-this._x, -this._y);
	}
	
	clone() {
		return new Point(this._x, this._y);
	}
	
}
