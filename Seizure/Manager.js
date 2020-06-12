const register = new Map();

export class Manager {
	
	static addToRegister(name, sz) {
		register.set(name, sz);
	}
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(app) {
		this._app      = app;
		this._register = register;
		this._loading  = null;
		this._reset    = () => {};
		this._actives  = [];
	}
	
	init() {
		this.create('Loading', {}, true);
	}
	
	//================================================================
	// Tick & draw
	//================================================================
	
	tick(delta) {
		this.getActive().tick(delta);
	}
	
	draw() {
		for ( const sz of this._actives ) {
			sz.draw();
		}
	}
	
	//================================================================
	// Manage
	//================================================================
	
	create(sz, input = {}, activate = false) {
		input.app       = this._app;
		input.szManager = this;
		const newSz = new (this._register.get(sz))(input);
		if ( activate ) {
			this._actives.push(newSz);
		}
		newSz.init(input);
		return newSz;
	}
	
	set(sz, input, popup = false) {
		this.forAll( (sz) => { sz.resetInput(); });
		if ( popup === false ) {
			this._closeActive();
			this._reset = () => this.set(sz, input);
		}
		//this._actives.push( this._loading );
		//setTimeout( () => {
		//this._closeActive();
		this.create(sz, input, true);
		//}, 1000);
	}
	
	reset() {
		this._reset();
	}
	
	countActives() {
		return this._actives.length;
	}
	
	getActive() {
		if ( this._actives.length > 0 ) {
			return this._actives[this._actives.length-1];
		}
		alert('Error: Getting undefined active');
	}
	
	forActive(fn) {
		const active = this.getActive();
		return fn(active);
	}
	
	forAll(fn) {
		for ( const sz of this._actives ) {
			fn(sz);
		}
	}
	
	_closeActive() {
		if ( this._actives.length > 0 ) {
			const toRelease = this._actives.pop();
			toRelease.release();
		}
	}
	
	//================================================================
	// Pop up
	//================================================================
	
	popUp(sz, input) {
		this.set(sz, input, true);
	}
	
	closePopUp() {
		this._closeActive();
	}
	
}
