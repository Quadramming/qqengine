QQ.Seizures = {
	register: new Map
};

QQ.Seizures.Manager = class Seizures {
	
	constructor(app) {
		this._register = QQ.Seizures.register;
		this._app      = app;
		this._loading  = null;
		this._reset    = () => {};
		this._actives  = [];
	}
	
	init() {
		this._loading = new (this._register.get('Loading'))(this._app);
		this._actives.push(this._loading);
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
			this._reset = () => { this.set(sz, input); };
		}
		//this._actives.push( this._loading );
		//setTimeout( () => {
		//this._closeActive();
		this._actives.push(
			new (this._register.get(sz))(this._app, input)
		);
		//}, 1000);
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
		return new (this._register.get(sz))(this._app, input);
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
