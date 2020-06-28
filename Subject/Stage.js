import {Group} from './Group.js';

function reset(options = {}) {
	this._world = options.world;
}

export class Stage extends Group {
	
	constructor(options) {
		super(options);
		this._world = undefined;
		reset.call(this, options);
	}
	
	reset(options) {
		super.reset(options);
		reset.call(this, options);
	}
	
	getWorld() {
		return this._world;
	}
	
}
