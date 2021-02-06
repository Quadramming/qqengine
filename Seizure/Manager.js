// QQDOC

import * as QQ from '../QQ.js';

const register = new Map();

export class Manager {

	static registerSeizure(name, sz) {
		register.set(name, sz);
	} // void
	
	#actives = [];
	reset; // Will be method of reset
	
	init() {
		this.#activateNew('Loading');
	} // void
	
	tick(delta) {
		this.getActive().tick(delta);
	} // void
	
	draw() {
		for ( const sz of this.#actives ) {
			sz.draw();
		}
	} // void
	
	create(szName, options = {}) {
		options.szManager = this;
		const newSz = new (register.get(szName))(options);
		newSz.init?.(options);
		return newSz;
	} // new Seizure
	
	set(...args) {
		this.#closeActive();
		this.popUp(...args);
	} // void
	
	popUp(sz, options) {
		this.reset = () => this.set(sz, options);
		this.forAll( sz => sz.resetInput() );
		this.#activateNew(sz, options);
	} // void
	
	closePopUp() {
		this.#closeActive();
	} // void
	
	countActives() {
		return this.#actives.length;
	} // number
	
	getActive() {
		if ( this.#actives.length > 0 ) {
			return QQ.getLast(this.#actives);
		}
		throw Error(`No active seizures`);
	} // Seizure
	
	forActive(fn) {
		return fn( this.getActive() );
	} // fn return
	
	forAll(fn) {
		for ( const sz of this.#actives ) {
			fn(sz);
		}
	} // void
	
	#activateNew(...args) {
		this.#actives.push(this.create(...args));
	} // void
	
	#closeActive() {
		const toDestruct = this.#actives.pop();
		toDestruct.destructor();
	} // void
	
}
