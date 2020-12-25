import * as QQ from '../QQ.js';

function fixOptions(options) {
}

export function nameMix(base) {
	return class nameMix extends base {
		
		#variable; // no "=". Should be in reset
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		destructor() {
			super.destructor();
		}
		
		reset(options = {}) {
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		}
		
		#reset(options) {
			// Do reset
		}
		
	}
}
