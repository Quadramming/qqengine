import {Size} from './Size.js';

export class Scale extends Size {
	
	cloneOposite() {
		return new Scale(-this._x, -this._y);
	}
	
	clone() {
		return new Scale(this._x, this._y);
	}
	
}
