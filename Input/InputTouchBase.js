// QQDOC

import {InputBase} from './InputBase.js';

export class InputTouchBase extends InputBase {
	
	#startHandler = event => this._handleStart(event);
	#moveHandler = event => this._handleMove(event);
	#endHandler = event => this._handleEnd(event);
	
	constructor(target) {
		super(target);
		this.#registerListners();
	}
	
	destructor() {
		this._target.removeEventListener('touchstart', this.#startHandler);
		this._target.removeEventListener('touchmove', this.#moveHandler);
		this._target.removeEventListener('touchend', this.#endHandler);
		this._target.removeEventListener('touchcancel', this.#endHandler);
	}
	
	#registerListners() {
		this._target.addEventListener('touchstart', this.#startHandler, {passive: false});
		this._target.addEventListener('touchmove', this.#moveHandler, {passive: false});
		this._target.addEventListener('touchend', this.#endHandler, {passive: false});
		this._target.addEventListener('touchcancel', this.#endHandler, {passive: false});
	} // void
	
}
