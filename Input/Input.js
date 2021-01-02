// QQDOC

import * as CONST from '../CONST/index.js';
import {InputBase} from './InputBase.js';

export class Input extends InputBase {
	
	#startHandler;
	#moveHandler;
	#endHandler;
	
	constructor(target, queue) {
		super(target, queue);
		this.#startHandler = this.#handleStart.bind(this);
		this.#moveHandler = this.#handleMove.bind(this);
		this.#endHandler = this.#handleEnd.bind(this);
		target.addEventListener('touchstart', this.#startHandler, {passive: false});
		target.addEventListener('touchmove', this.#moveHandler, {passive: false});
		target.addEventListener('touchend', this.#endHandler, {passive: false});
		target.addEventListener('touchcancel', this.#endHandler, {passive: false});
	}
	
	destructor() {
		this._target.removeEventListener('touchstart', this.#startHandler);
		this._target.removeEventListener('touchmove', this.#moveHandler);
		this._target.removeEventListener('touchend', this.#endHandler);
		this._target.removeEventListener('touchcancel', this.#endHandler);
	}
	
	#handleStart(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.START,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
	#handleMove(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.MOVE,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
	#handleEnd(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.END,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
}
