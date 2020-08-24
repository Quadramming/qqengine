// QQDOC

export class Value {
	
	#value; // Mixed saved value
	
	constructor(value = 0) {
		this.#value = 0;
		this.v(value);
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
				throw new Error('Value should be number');
			}
			this.#value = value;
		}
		return this.#value;
	} // mixed
	
	v(value) { // {F}
		return this.value(value);
	} // mixed
	
}
