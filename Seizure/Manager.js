// QQDOC

import * as QQ from '../QQ.js';

const register = new Map();

export class Manager {

	static registerSeizure(name, sz) {
		register.set(name, sz);
	}
	
	constructor() {
		this._reset = () => {};
		this._actives = [];
		this._toSet = null;
		this._toCloseActive = false;
		this._loading = null;
	}
	
	init() {
		this.create('Loading', {}, true);
	}
	
	tick(delta) {
		if ( this._toCloseActive ) {
			this._closeActive();
			this._toCloseActive = false;
		}
		if ( this._toSet ) {
			this._toSet();
			this._toSet = null;
		}
		this.getActive().tick(delta);
	}
	
	draw() {
		for ( const sz of this._actives ) {
			sz.draw();
		}
	}
	
	create(sz, input = {}, activate = false) {
		input.szManager = this;
		const newSz = new (register.get(sz))(input);
		if ( activate ) {
			this._actives.push(newSz);
		}
		newSz.init(input);
		return newSz;
	}
	
	set(...args) {
		this._toSet = () => this._set(...args);
	}
	
	_set(sz, input, popup = false) {
		this._reset = () => this.set(sz, input);
		this.forAll( sz => sz.resetInput() );
		if ( popup === false ) {
			this._closeActive();
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
			return QQ.getLast(this._actives);
		}
		throw new Error(`No active seizures`);
	}
	
	forActive(fn) {
		return fn( this.getActive() );
	}
	
	forAll(fn) {
		for ( const sz of this._actives ) {
			fn(sz);
		}
	}
	
	popUp(sz, input) {
		this.set(sz, input, true);
	}
	
	closePopUp() {
		this._toCloseActive = true;
	}
	
	_closeActive() {
		if ( this._actives.length > 0 ) {
			const toDestruct = this._actives.pop();
			toDestruct.destructor();
		}
	}
	
}
