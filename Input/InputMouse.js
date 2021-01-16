// QQDOC

import * as QQ from '../QQ.js';
import * as CONST from '../CONST/index.js';
import {InputBase} from './InputBase.js';

export class InputMouse extends InputBase {
	
	#startHandler = event => this.#mouseUp(event);
	#moveHandler = event => this.#mouseMove(event);
	#endHandler = event => this.#mouseDown(event);
	
	constructor(target) {
		super(target);
		this.#registerListners();
	}
	
	destructor() {
		this._target.removeEventListener('mousedown', this.#startHandler);
		this._target.removeEventListener('mousemove', this.#moveHandler);
		this._target.removeEventListener('mouseup', this.#endHandler);
	}
	
	#registerListners() {
		this._target.addEventListener('mousedown', this.#startHandler, {passive: false});
		this._target.addEventListener('mousemove', this.#moveHandler, {passive: false});
		this._target.addEventListener('mouseup', this.#endHandler, {passive: false});
	} // void
	
	#mouseMove(event) {
		this._prevent(event);
		if ( QQ.isNumbers(event.clientX, event.clientY, event.buttons) ) {
			this._queue.push({
				type: CONST.TOUCH.MOVE,
				id: 0,
				point: this._getPoint(event.clientX, event.clientY)
			});
		}
	} // void
	
	#mouseDown(event) {
		this._prevent(event);
		if ( QQ.isNumbers(event.clientX, event.clientY) ) {
			this._queue.push({
				type: CONST.TOUCH.END,
				id: 0,
				point: this._getPoint(event.clientX, event.clientY)
			});
		}
	} // void
	
	#mouseUp(event) {
		this._prevent(event);
		if ( QQ.isNumbers(event.clientX, event.clientY) ) {
			this._queue.push({
				type: CONST.TOUCH.START,
				id: 0,
				point: this._getPoint(event.clientX, event.clientY)
			});
		}
	} // void
	
}
