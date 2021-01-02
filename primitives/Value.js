// QQDOC

export class Value {
	
	#value; // Mixed saved value
	
	constructor(value = 0) {
		this.#value = 0;
		this.v(value);
	}
	
	isClear() {
		return this.#value === 0;
	} // Boolean
	
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
	} // Mixed
	
	v(value) { // {F}
		return this.value(value);
	} // Mixed
	
}
