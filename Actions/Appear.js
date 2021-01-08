// QQDOC

import {Idle} from './Idle.js';

export class Appear extends Idle {
	
	constructor(options = {}) {
		options.duration ??= 1;
		super(options);
	}
	
	tickFn(delta) { // {O}
		this._subject.alpha(this._progress);
	} // void
	
	onEnd() { // {O}
		this._subject.alpha(1);
	} // void
	
}
