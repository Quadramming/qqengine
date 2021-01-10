// QQDOC

import * as matrix from '../matrix.js';
import {Pack} from './Pack.js';

export class MatrixCache extends Pack {
	
	#target;
	#matrix;
	
	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // void
	
	#reset(options) {
		this.#target = options.parent;
		// #target can be defined latter on addSubject()
		this.#matrix = this.#target?.calcMatrix() ?? matrix.getIdentity();
	} // void

	get() {
		if ( this.isChanged() ) {
			this.#matrix = this.#target.calcMatrix();
			this.position().copy(this.#target.position());
			this.size().copy(this.#target.size());
			this.scale().copy(this.#target.scale());
			this.anchor().copy(this.#target.anchor());
			this.angle(this.#target.angle());
		}
		return this.#matrix;
	} // matrix
	
	isChanged() {
		if ( ! this.position().isEquals(this.#target.position()) ) {
			return true;
		}
		if ( ! this.size().isEquals(this.#target.size()) ) {
			return true;
		}
		if ( ! this.scale().isEquals(this.#target.scale()) ) {
			return true;
		}
		if ( ! this.anchor().isEquals(this.#target.anchor()) ) {
			return true;
		}
		if ( this.angle() !== this.#target.angle() ) {
			return true;
		}
		return false;
	} // boolean
	
}
