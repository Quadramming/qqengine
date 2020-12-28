// QQDOC

import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class WalkTo extends Idle {
	
	_to = new Point();
	#prevPosition;
	
	constructor(options) {
		super(options);
		this._to.copy(options.to);
		this.#prevPosition = new Point(NaN);
	}
	
	setTarget(to) {
		this._to.copy(to);
	} // void
	
	getTarget() {
		return this._to;
	} // subj
	
	tick(delta) { // {O}
		if ( this.#prevPosition.isNear(this._subj.position()) ) {
			this.finishAction();
			return;
		}
		const walked = this._subj.getSpeed() * delta;
		const from = this._subj.position();
		const to = this._to;
		const A = to.y() - from.y();
		const B = to.x() - from.x();
		const C = Math.sqrt(A*A + B*B);
		const sin = A/C;
		const cos = B/C;
		const a = cos * walked;
		const b = sin * walked;
		if ( walked < C ) {
			this.#prevPosition.copy(this._subj.position());
			this._subj.addPosition(new Point(a, b));
		} else {
			this._subj.position(to);
			this.finishAction();
		}
	}
	
}
