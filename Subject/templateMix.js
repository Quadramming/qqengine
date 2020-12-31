import * as QQ from '../QQ.js';

function fixOptions(options) {
}

export function nameMix(base) {
	return class nameMix extends base {
		
		#variable; // no "=" allowed. It Should be in reset method
		#point = new Point(); // But can be allocation
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		destructor() { // {O}
			super.destructor();
		}
		
		reset(options = {}) { // {O}
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		} // Void
		
		#reset(options) {
			// Do reset
		} // Void
		
	}
}
