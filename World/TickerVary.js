// QQDOC

import * as QQ from '../QQ.js';

export class TickerVary {
	
	#maxDelta;
	#isPauseOnOverflow;
	
	constructor(options = {}) {
		this.#maxDelta = options.maxDelta ?? 0.5;
		this.#isPauseOnOverflow = options.isPauseOnOverflow ?? false;
	}
	
	tick(delta, fn) {
		if ( delta < this.#maxDelta ) {
			fn(delta);
		} else if ( this.#isPauseOnOverflow ) {
			QQ.APP.pause();
		}
	} // void
	
}
