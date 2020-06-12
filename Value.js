export class Value {
	
	constructor(value = 0) {
		this._value = 0;
		this.v(value);
	}
	
	clear() {
		this._value = 0;
	}
	
	invert() {
		this._value *= -1;
	}
	
	v(value) {
		return this.value(value);
	}
	
	value(value) {
		if ( value !== undefined ) {
			if ( typeof value !== 'number' ) {
				throw new Error('Value should be number');
			}
			this._value = value;
		}
		return this._value;
	}
	
	isClear() {
		return this._value === 0;
	}
	
}
