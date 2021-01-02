// QQDOC

import * as maths from '../maths.js';
import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class DropOut extends Idle {
	
	#force = new Point();
	
	constructor(options) {
		options.duration = 2;
		super(options);
		this.#force.set(maths.rand(-0.1, 0.1, false), -0.3);
	}
	
	tick(delta) {
		const subj = this.subj();
		super.tick(delta);
		this.#force.y(this.#force.y()+delta);
		const position = subj.position();
		position.add(this.#force);
		subj.position(position);
		subj.angle(subj.angle()+delta*20);
		subj.alpha(1 - this._progress);
	}
	
	onEnd() {
		this.subj().destructor();
	}
	
}
