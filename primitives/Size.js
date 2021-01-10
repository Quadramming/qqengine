// QQDOC

import {XY} from './XY.js';

export class Size extends XY {
	
	width(value) { // {F}
		return this.x(value);
	} // number
	
	height(value) { // {F}
		return this.y(value);
	} // number
	
	w(value) { // {F}
		return this.x(value);
	} // number
	
	h(value) { // {F}
		return this.y(value);
	} // number
	
}
