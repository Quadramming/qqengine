import * as QQ from '../QQ.js';

function reset(options = {}) {
}

function fixOptions(options) {
}

export function nameMix(base) {
	return class nameMix extends base {
		
		constructor(options) {
			fixOptions(options);
			super(options);
			reset.call(this, options);
		}
		
		destructor() {
			super.destructor();
		}
		
		reset(options) {
			fixOptions(options);
			super.reset(options);
			reset.call(this, options);
		}
		
	}
}
