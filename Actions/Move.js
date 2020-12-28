// QQDOC

import {Point} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Move extends Idle {
	
	#from;
	#to;
	#distance;
	
	constructor(options) {
		super(options);
		this.#from = options.from.clone();
		this.#to = options.to.clone();
		this.#distance = Point.subtraction(this.#to, this.#from);
	}
	
	tick(delta) {
		super.tick(delta);
		this._subj.position().set(
			this.#from.x() + this._progress * this.#distance.x(),
			this.#from.y() + this._progress * this.#distance.y()
		);
	}
	
}
