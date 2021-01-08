// QQDOC

import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Move extends Idle {
	
	#from = new Point();
	#to = new Point();
	#distance;
	
	constructor(options = {}) {
		options.duration ??= 1;
		super(options);
		if ( options.from ) {
			this.#from.copy(options.from);
		} else { // From subject
			this.#from.copy(this._subject.position());
		}
		this.#to.copy(options.to);
		this.#distance = Point.subtraction(this.#to, this.#from);
	}
	
	tickFn(delta) { // {O}
		this._subject.position().set(
			this.#from.x() + this._progress * this.#distance.x(),
			this.#from.y() + this._progress * this.#distance.y()
		);
	} // void
	
}
