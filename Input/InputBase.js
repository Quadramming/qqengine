// QQDOC

import {Point} from '../primitives/index.js';

export class InputBase {
	
	_queue = [];
	_target;
	
	constructor(target) {
		this._target = target;
	}
	
	releaseQueue() {
		const released = this._queue;
		this._queue = [];
		return released;
	} // array
	
	_prevent(event) {
		if ( event.cancelable ) event.preventDefault();
	} // void
	
	_getPoint(pageX, pageY) {
		return new Point(
			pageX - this._target.offsetLeft,
			pageY - this._target.offsetTop,
		);
	} // new Point
	
}
