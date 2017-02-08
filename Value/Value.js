QQ.Value = class Value {
	
	constructor(input = 0) {
		this._val = input;
	}
	
	clear() {
		this._val = 0;
	}
	
	invert() {
		this._val *= -1;
	}
	
	v(input) {
		if ( input !== undefined ) {
			this._val = input;
		}
		return this._val;
	}
	
	isClear() {
		return this._val === 0;
	}
	
};
