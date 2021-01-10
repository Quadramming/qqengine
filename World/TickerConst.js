// QQDOC

import * as QQ from '../QQ.js';

export class TickerConst {
	
	#deltaAccum = 0;
	#maxDelta;
	#maxTicks;
	#tickTimeStep;
	#isPauseOnOverflow;
	
	constructor(options = {}) {
		this.#maxDelta = options.maxDelta ?? 0.5;
		this.#maxTicks = options.maxTicks ?? 5;
		this.#tickTimeStep = options.tickTimeStep ?? 0.0166;
		this.#isPauseOnOverflow = options.isPauseOnOverflow ?? false;
	}
	
	tick(delta, fn) {
		this.#deltaAccum += delta;
		if ( this.#deltaAccum > this.#maxDelta ) {
			this.#deltaAccum = 0; // Skip ticks
			if ( this.#isPauseOnOverflow ) {
				QQ.APP.pause();
			}
			return;
		}
		let ticksDone = 0;
		while ( this.#deltaAccum > this.#tickTimeStep) {
			fn(this.#tickTimeStep);
			this.#deltaAccum -= this.#tickTimeStep;
			ticksDone++;
			if ( ticksDone >= this.#maxTicks ) {
				this.#deltaAccum = 0;
				return;
			}
		}
	} // void
	
}
