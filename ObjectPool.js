// QQDOC

import * as QQ from './QQ.js';

export class ObjectPool {
	
	#pool = [];
	#free = [];
	#amount;
	#increment;
	#createFn;
	#initFn;
	#releaseFn;
	
	constructor(options) {
		this.#amount = options.amount ?? 16;
		this.#increment = options.increment ?? 8;
		this.#createFn = options.create;
		this.#initFn = options.init ?? null;
		this.#releaseFn = options.release ?? null;
		this.reset();
	}
	
	reset() {
		this.clean();
		this.#grow(this.#amount);
	} // void
	
	clean() {
		if ( this.#releaseFn ) {
			for ( const obj of this.#pool ) {
				this.#releaseFn(obj);
			}
		}
		this.#pool.length = 0;
		this.#free.length = 0;
	} // void
	
	get(options) {
		if ( QQ.isEmpty(this.#free) ) this.#grow();
		const index = this.#free.pop();
		const obj = this.#pool[index];
		this.#initFn?.(obj, options);
		return obj;
	} // Object
	
	release(obj) {
		this.#releaseFn?.(obj);
		const index = this.#pool.indexOf(obj);
		if ( index !== -1 ) {
			this.#free.push(index);
		} else {
			throw Error('Wrong index');
		}
	} // void
	
	debug() {
		c("================================");
		c("ObjectPool debug");
		c("================================");
		c("free array:");
		c(this.#free);
		c('free.length' + this.#free.length);
		c('pool.length' + this.#pool.length);
		c("================================");
	} // void
	
	#grow(amount = this.#increment) {
		const size = this.#pool.length;
		for ( let i = 0; i < amount; ++i ) {
			this.#free.push(size + i);
			this.#pool.push( this.#createFn() );
		}
	} // void
	
}
