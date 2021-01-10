// QQDOC

export class Value {
	
	#value; // Saved number
	
	constructor(value = 0) {
		this.value(value);
	}
	
	isClear() {
		return this.#value === 0;
	} // boolean
	
	clear() {
		this.#value = 0;
		return this;
	} // this
	
	invert() {
		this.#value *= -1;
		return this;
	} // this
	
	value(value) { // {F}
		if ( value !== undefined ) {
			if ( typeof value !== 'number' ) {
				throw Error('Value should be number');
			}
			this.#value = value;
		}
		return this.#value;
	} // number
	
	v(value) { // {F}
		return this.value(value);
	} // number
	
}
