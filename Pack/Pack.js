// QQDOC

import {Point, Size, Scale, Anchor} from '../primitives/index.js';

export class Pack {
	
	#size = new Size();
	#scale = new Scale();
	#position = new Point();
	#anchor = new Anchor();
	#angle;
	#z;
	
	// Can be overridden:
	// packUpdate()
	// tick(delta)
	
	constructor(options = {}) {
		this.#reset(options);
	}
	
	reset(options = {}) { // {V}
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#size.copyOrSet(options.size, 1, 1);
		this.#scale.copyOrSet(options.scale, 1, 1);
		this.#position.copyOrSet(options.position, 0, 0);
		this.#anchor.copyOrSet(options.anchor, 0.5, 0.5);
		this.#angle = options.angle ?? 0;
		this.#z = options.z ?? 0;
	} // void
	
	size(size) { // {F}
		if ( size !== undefined ) {
			this.#size.copy(size);
			this.packUpdate?.();
		}
		return this.#size;
	} // Size
	
	scale(scale) { // {F}
		if ( scale !== undefined ) {
			this.#scale.copy(scale);
			this.packUpdate?.();
		}
		return this.#scale;
	} // Scale
	
	position(position) { // {F}
		if ( position !== undefined ) {
			this.#position.copy(position);
			this.packUpdate?.();
		}
		return this.#position;
	} // Point
	
	anchor(anchor) { // {F}
		if ( anchor !== undefined ) {
			this.#anchor.copy(anchor);
			this.packUpdate?.();
		}
		return this.#anchor;
	} // Anchor
	
	angle(angle) { // {F}
		if ( angle !== undefined ) {
			this.#angle = angle;
			this.packUpdate?.();
		}
		return this.#angle;
	} // number
	
	z(z) { // {F}
		if ( z !== undefined ) {
			this.#z = z;
			this.packUpdate?.();
		}
		return this.#z;
	} // number
	
}
