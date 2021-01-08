// QQDOC

import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class WalkTo extends Idle {
	
	_to = new Point(); // Protected for Patrol action
	#prevPosition = new Point(NaN);
	#power = 1;
	
	constructor(options) {
		super(options);
		this._to.copy(options.to);
		if ( options.power ) this.#power = options.power;
	}
	
	set(to, power) {
		this._to.copy(to);
		if ( power ) this.#power = power;
	} // void
	
	tickFn(delta) { // {O}
		const subj = this._subject;
		const subjPosition = subj.position();
		if ( this.#prevPosition.isNear(subjPosition) ) { // Stucked
			this.end();
			return;
		}
		const walked = subj.getSpeed() * this.#power * delta;
		const remain = Point.subtraction(this._to, subjPosition);
		if ( walked < remain.getLength() ) {
			this.#prevPosition.copy(subjPosition);
			subj.addPosition(remain.getCos()*walked, remain.getSin()*walked);
		} else {
			subj.position(this._to);
			this.end();
		}
	} // void
	
}
