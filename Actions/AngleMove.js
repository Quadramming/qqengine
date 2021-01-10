// QQDOC

import {Idle} from './Idle.js';

export class AngleMove extends Idle {
	
	#from;
	#to;
	#offsetX;
	#offsetY;
	#signX;
	#signY;
	#distance;
	
	constructor(options = {}) {
		options.duration ??= 1;
		super(options);
		this.#from = options.from;
		this.#to = options.to;
		this.#offsetX = Math.abs(this.#to.x() - this.#from.x());
		this.#offsetY = Math.abs(this.#to.y() - this.#from.y());
		this.#signX = this.#to.x() < this.#from.x() ? -1 : 1;
		this.#signY = this.#to.y() < this.#from.y() ? -1 : 1;
		this.#distance = this.#offsetX + this.#offsetY;
	}
	
	tickFn(delta) { // {O}
		const passed = this.#distance * this._progress;
		const progressX = passed < this.#offsetX ? passed : this.#offsetX;
		const progressY = passed < this.#offsetX ? 0 : passed - this.#offsetX;
		this._subject.position().set(
			this.#from.x() + progressX*this.#signX,
			this.#from.y() + progressY*this.#signY
		);
	} // void
	
}
