// QQDOC

import {Point, Size} from '../primitives/index.js';
import {Idle} from './Idle.js';

export class Shake extends Idle {
	
	#dispersion = new Size(1, 1);
	#position = new Point();
	#period;
	
	constructor(options = {}) {
		super(options);
		if ( options.dispersion ) this.#dispersion.copy(options.dispersion);
		this.#period = options.period ?? 1;
		this.#position.copy( this._subject.position() );
	}
	
	tickFn(delta) { // {O}
		this._subject.position().set(this.#calcPosition());
	} // void
	
	#calcPosition() {
		const time = this._lasting * Math.PI*2 / this.#period;
		return [
			this.#position.x() + this.#dispersion.w() * Math.sin(time)/2,
			this.#position.y() + this.#dispersion.h() * Math.cos(time)/2
		];
	} // [x:number, y:number]
	
}
