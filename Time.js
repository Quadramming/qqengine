// QQDOC

import * as CONST from './CONST/index.js';

function msToSeconds(ms) {
	return ms / CONST.MS_IN_SECOND;
}

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
		return msToSeconds(diff);
	} // number
	
}
