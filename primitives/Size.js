// QQDOC

import {XY} from './XY.js';

export class Size extends XY {
	
	width(value) { // {F}
		return this.x(value);
	} // Number
	
	height(value) { // {F}
		return this.y(value);
	} // Number
	
	w(value) { // {F}
		return this.x(value);
	} // Number
	
	h(value) { // {F}
		return this.y(value);
	} // Number
	
}
