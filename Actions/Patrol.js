// QQDOC

import {WalkTo} from './WalkTo.js';

export class Patrol extends WalkTo {
	
	_from;
	
	constructor(options) {
		super(options);
		this._from = options.from;
	}
	
	finishAction() { // {O}
		this.changeDirection();
	}
	
	changeDirection() {
		[this._from, this._to] = [this._to, this._from];
	}
	
}
