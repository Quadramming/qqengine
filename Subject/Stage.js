// QQDOC

import {Group} from './Group.js';

export class Stage extends Group {
	
	#world;
	
	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) {
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#world = options.world;
	} // void
	
	getWorld() {
		return this.#world;
	} // World
	
}
