// QQDOC

import * as matrix from '../matrix.js';
import {Pack} from './Pack.js';

export class MatrixCache extends Pack {
	
	#parent;
	#matrix;
	
	constructor(options = {}) {
		super(options);
		this.#reset(options);
	}
	
	reset(options = {}) { // {O}
		super.reset(options);
		this.#reset(options);
	} // Void
	
	#reset(options) {
		this.#parent = options.parent;
		if ( this.#parent ) {
			this.#matrix = this.#parent.calcMatrix();
		} else {
			// In case when parent will be set latter
			this.#matrix = matrix.getIdentity();
		}
	} // Void

	get() {
		if ( this.isChanged() ) {
			this.#matrix = this.#parent.calcMatrix();
			this.position().copy(this.#parent.position());
			this.size().copy(this.#parent.size());
			this.scale().copy(this.#parent.scale());
			this.anchor().copy(this.#parent.anchor());
			this.angle(this.#parent.angle());
		}
		return this.#matrix;
	} // Matrix
	
	isChanged() {
		if ( ! this.position().isEquals(this.#parent.position()) ) {
			return true;
		}
		if ( ! this.size().isEquals(this.#parent.size()) ) {
			return true;
		}
		if ( ! this.scale().isEquals(this.#parent.scale()) ) {
			return true;
		}
		if ( ! this.anchor().isEquals(this.#parent.anchor()) ) {
			return true;
		}
		if ( this.angle() !== this.#parent.angle() ) {
			return true;
		}
		return false;
	} // Boolean
	
}
