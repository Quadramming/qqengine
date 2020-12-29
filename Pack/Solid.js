// QQDOC

import {Pack} from './Pack.js';
import {Point, Size, Rect, Offset} from '../primitives/index.js';
import {SOLID} from '../CONST/index.js';
import * as QQ from '../QQ.js';

export class Solid extends Pack {
	
	#offset = new Offset(); // Offset form basis is basis exists
	#getBasis; // Function to get current position
	#type;
	#weight;

	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // Void
	
	#reset(options) {
		this.#offset.copyOrSet(options.offset, 0, 0);
		this.#getBasis = options.getBasis ?? null;
		this.#type = options.type ?? SOLID.STATIC;
		this.#weight = options.weight ?? 1;
	} // Void
	
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
			this.packUpdate();
		}
		return this.#weight;
	} // Number
	
	type(type) { // {F}
		if ( type !== undefined ) {
			this.#type = type;
			this.packUpdate();
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
