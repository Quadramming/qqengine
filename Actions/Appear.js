import {Idle} from './Idle.js';

export class Appear extends Idle {
	
	tick(delta) {
		super.tick(delta);
		this._subj.setAlpha(this._progress);
	}
	
	onEnd() {
		this._subj.setAlpha(1);
	}
	
}
