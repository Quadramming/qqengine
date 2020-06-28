import * as QQ from '../QQ.js';

function reset(options = {}) {
}

export function nameMix(base) {
	return class nameMix extends base {
		
		constructor(options) {
			super(options);
			reset.call(this, options);
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this, options);
		}
		
	}
}
