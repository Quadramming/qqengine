QQ.Seizures = class Seizures {
	
	constructor() {
		this._loading  = null;
		this._reset    = () => {};
		this._seizures = [];
		this._actives  = [];
	}
	
	init() {
		this._loading = new QQ.Seizures.SeizureLoading();
		this._actives.push(this._loading);
	}
	
	add(name, newSeizure) {
		this._seizures[name] = newSeizure;
	}
	
	popUp(sz, input) {
		this.set(sz, input, true);
	}
	
	closePopUp() {
		this._closeActive();
	}
	
	reset() {
		this._reset();
	}
	
	set(sz, input, popup = false) {
		if ( popup === false ) {
			this._closeActive();
			this._reset = () => { this.set(sz, input, popup); };
		}
		this._actives.push( this._loading );
		//setTimeout( () => {
			this._closeActive();
			this._actives.push( new this._seizures[sz](input) );
		//}, 200);
	}
	
	tick(delta) {
		this._getActive().tickBase(delta);
	}
	
	draw() {
		for ( let sz of this._actives ) {
			sz.draw();
		}
	}
	
	clickDown(x, y) {
		this._getActive().clickDownBase(x, y);
	}
	
	clickUp(x, y) {
		this._getActive().clickUpBase(x, y);
	}
	
	create(sz, input) {
		return new this._seizures[sz](input);
	}
	
	_closeActive() {
		if ( this._actives.length > 0 ) {
			this._actives.pop();
		}
	}
	
	_getActive() {
		if ( this._actives.length > 0 ) {
			return this._actives[this._actives.length-1];
		}
		alert('Error: Getting undefined active');
	}
	
};

QQ.seizures = new QQ.Seizures();