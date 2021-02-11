// QQDOC

import {XY} from './primitives/index.js';
import {Pack} from './Pack/index.js';

function pushXY(array, xy) {
	array.push(xy.x(), xy.y());
}

export class Cache {
	
	#pack = []; // Pack of arguments of cache for current value
	#savedPack = []; // Possible pack of arguments for next value (saved in isChanged())
	#value; // Cached value
	
	constructor() {
		this.reset();
	}
	
	reset() {
		this.#pack = [];
		this.#savedPack = [];
		this.#value = null;
	} // void
	
	isChanged(...args) {
		const pack = [];
		for ( const arg of args ) {
			if ( arg instanceof Pack ) {
				pushXY(pack, arg.position());
				pushXY(pack, arg.size());
				pushXY(pack, arg.scale());
				pushXY(pack, arg.anchor());
				pack.push(arg.angle());
			} else if ( arg instanceof XY ) {
				pushXY(pack, arg);
			} else {
				pack.push(arg);
			}
		}
		if (
			pack.length === this.#pack.length &&
			pack.every((v, i) => v === this.#pack[i])
		) {
			return false;
		}
		this.#savedPack = pack;
		return true;
	} // boolean
	
	get() {
		return this.#value;
	} // mixed | null
	
	set(value) {
		this.#value = value;
		this.#pack = this.#savedPack;
	} // void
	
}
