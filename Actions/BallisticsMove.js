// QQDOC

import {Point, Size} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class BallisticsMove extends Idle {
	
	#from = new Point();
	#to = new Point();
	#size = new Size();
	
	constructor(options = {}) {
		options.duration ??= 1;
		super(options);
		this.#from.copy( this._subject.position() );
		this.#to.copy( options.to );
		this.#size.copy( this._subject.size() );
	}
	
	tickFn(delta) { // {O}
		const distance = Point.subtraction(this.#to, this.#from);
		this._subject.position().set(
			this.#from.x() + this._progress * distance.x(),
			this.#from.y() + this._progress * distance.y()
		);
		const value = Math.sin(this._progress*3.14); // 0 -> 1 -> 0
		this._subject.size().set(
			this.#size.w() + value,
			this.#size.h() + value
		);
	} // void
	
	onEnd() { // {O}
		this._subject.size(this.#size);
		this._subject.position(this.#to);
	} // void
	
}
