// QQDOC

import {Point} from '../primitives/index.js';

export class InputBase {
	
	_target;
	_queue;
	
	constructor(target, queue) {
		this._target = target;
		this._queue = queue;
	}
	
	_prevent(event) {
		if ( event.cancelable ) event.preventDefault();
	}
	
	_getPoint(pageX, pageY) {
		return new Point(
			pageX - this._target.offsetLeft,
			pageY - this._target.offsetTop,
		);
	}
	
}
