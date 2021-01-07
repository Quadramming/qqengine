// QQDOC

import * as maths from './maths.js';

export class Time {
	
	#time; // Time value
	
	constructor() {
		this.#time = Date.now();
	}
	
	now() {
		return this.#time;
	} // number
	
	update() {
		const previousTime = this.#time;
		this.#time = Date.now();
		const diff = this.#time - previousTime;
		return maths.msToSeconds(diff);
	} // number
	
}
