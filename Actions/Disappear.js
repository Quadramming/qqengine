import {Idle} from './Idle.js';

export class Disappear extends Idle {
	
	tick(delta) {
		super.tick(delta);
		this._subj.alpha(1 - this._progress);
	}
	
	onEnd() {
		this._subj.destructor();
	}
	
}
