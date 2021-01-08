// QQDOC

import {Point} from '../primitives/index.js';
import {END_STRATEGY} from '../CONST/index.js';
import {WalkTo} from './WalkTo.js';

export class Patrol extends WalkTo {
	
	#from = new Point();
	
	constructor(options = {}) {
		super(options);
		this.#from.copy(options.from);
	}
	
	onEnd() { // {O}
		this.changeDirection();
		return END_STRATEGY.PREVENT_END;
	} // boolean
	
	changeDirection() {
		[this.#from, this._to] = [this._to, this.#from];
	} // void
	
}
