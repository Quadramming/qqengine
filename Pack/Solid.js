// QQDOC

import {Pack} from './Pack.js';
import {Rect, Offset} from '../primitives/index.js';
import {SOLID} from '../CONST/index.js';

export class Solid extends Pack {
	
	#offset = new Offset(); // Offset form basis is basis exists
	#getBasis; // Function to get current position
	#type; // Type of solid subject CONST.SOLID
	#weight; // Mass of subject

	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#offset.copyOrSet(options.offset, 0, 0);
		this.#getBasis = options.getBasis ?? null;
		this.#type = options.type ?? SOLID.STATIC;
		this.#weight = options.weight ?? 1;
	} // void
	
	position(position) { // {O}
		if ( this.#getBasis ) {
			const basis = this.#getBasis().clone();
			basis.add(this.#offset);
			return basis;
		}
		return super.position(position);
	} // Point
	
	weight(weight) { // {F}
		if ( weight !== undefined ) {
			this.#weight = weight;
			this.onPackUpdate?.();
		}
		return this.#weight;
	} // number
	
	type(type) { // {F}
		if ( type !== undefined ) {
			this.#type = type;
			this.onPackUpdate?.();
		}
		return this.#type;
	} // CONST.SOLID
	
	rect() {
		const position = this.position();
		const size = this.size();
		const anchor = this.anchor();
		return new Rect(
			position.x() - size.w()*anchor.x(),
			position.y() - size.h()*anchor.y(),
			size.w(),
			size.h()
		);
	} // new Rect
	
}
