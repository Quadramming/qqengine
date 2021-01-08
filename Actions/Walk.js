// QQDOC

import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Walk extends Idle {
	
	#direction = new Point();
	#power;
	
	constructor(options = {}) {
		super(options);
		this.#direction.copy(options.direction);
		this.#power = options.power ?? 1;
	}
	
	set(direction, power) {
		this.#direction.copy(direction);
		if ( power ) this.#power = power;
	} // void
	
	tickFn(delta) { // {O}
		const walked = this._subject.getSpeed() * this.#power * delta;
		this._subject.addPosition(
			this.#direction.getCos()*walked,
			this.#direction.getSin()*walked
		);
	} // void
	
}
