// QQDOC

import {Scale, Size} from '../primitives/index.js';

export class SpriteMatrixCache {
	
	#matrix = null;
	#size = new Size();
	#scale = new Scale();
	
	isChanged(size, scale) {
		if ( ! this.#matrix ) return true;
		if ( ! size.isEquals(this.#size) ) return true;
		if ( ! scale.isEquals(this.#scale) ) return true;
		return false;
	} // boolean
	
	get() {
		return this.#matrix;
	} // array
	
	set(matrix, size, scale) {
		this.#matrix = matrix;
		this.#size.copy(size);
		this.#scale.copy(scale);
	} // void
	
}
