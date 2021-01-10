// QQDOC

import {Point} from '../primitives/index.js';

export class InputBase {
	
	_queue;
	#target;
	#startHandler = event => this._handleStart(event);
	#moveHandler = event => this._handleMove(event);
	#endHandler = event => this._handleEnd(event);
	
	constructor(target, queue) {
		this._queue = queue;
		this.#target = target;
		this.#registerListners();
	}
	
	destructor() {
		this.#target.removeEventListener('touchstart', this.#startHandler);
		this.#target.removeEventListener('touchmove', this.#moveHandler);
		this.#target.removeEventListener('touchend', this.#endHandler);
		this.#target.removeEventListener('touchcancel', this.#endHandler);
	}
	
	#registerListners() {
		this.#target.addEventListener('touchstart', this.#startHandler, {passive: false});
		this.#target.addEventListener('touchmove', this.#moveHandler, {passive: false});
		this.#target.addEventListener('touchend', this.#endHandler, {passive: false});
		this.#target.addEventListener('touchcancel', this.#endHandler, {passive: false});
	} // void
	
	_prevent(event) {
		if ( event.cancelable ) event.preventDefault();
	} // void
	
	_getPoint(pageX, pageY) {
		return new Point(
			pageX - this.#target.offsetLeft,
			pageY - this.#target.offsetTop,
		);
	} // new Point
	
}
