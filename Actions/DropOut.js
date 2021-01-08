// QQDOC

import * as maths from '../maths.js';
import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class DropOut extends Idle {
	
	#force = new Point();
	
	constructor(options = {}) {
		options.duration ??= 1;
		super(options);
		this.#force.set(maths.rand(-0.1, 0.1, false), -0.3);
	}
	
	tickFn(delta) { // {O}
		const subj = this._subject;
		this.#force.y(this.#force.y() + delta);
		subj.position().add(this.#force);
		subj.angle(subj.angle() + delta*20);
		subj.alpha(1 - this._progress);
	} // void
	
	onEnd() { // {O}
		this._subject.destructor();
	} // void
	
}
