// QQDOC

import * as QQ from '../QQ.js';
import * as CONST from '../CONST/index.js';
import {Point} from '../primitives/index.js';

export class InputMouse {
	
	#queue;
	#target;
	#startHandler = event => this.#mouseUp(event);
	#moveHandler = event => this.#mouseMove(event);
	#endHandler = event => this.#mouseDown(event);
	
	constructor(target, queue) {
		this.#queue = queue;
		this.#target = target;
		this.#registerListners();
	}
	
	destructor() {
		this.#target.removeEventListener('mousedown', this.#startHandler);
		this.#target.removeEventListener('mousemove', this.#moveHandler);
		this.#target.removeEventListener('mouseup', this.#endHandler);
	}
	
	#registerListners() {
		this.#target.addEventListener('mousedown', this.#startHandler, {passive: false});
		this.#target.addEventListener('mousemove', this.#moveHandler, {passive: false});
		this.#target.addEventListener('mouseup', this.#endHandler, {passive: false});
	} // void
	
	#mouseMove(event) {
		this.#prevent(event);
		if ( QQ.isNumbers(event.clientX, event.clientY, event.buttons) ) {
			this.#queue.push({
				type: CONST.TOUCH.MOVE,
				id: 0,
				point: this.#getPoint(event.clientX, event.clientY)
			});
		}
	} // void
	
	#mouseDown(event) {
		this.#prevent(event);
		if ( QQ.isNumbers(event.clientX, event.clientY) ) {
			this.#queue.push({
				type: CONST.TOUCH.END,
				id: 0,
				point: this.#getPoint(event.clientX, event.clientY)
			});
		}
	} // void
	
	#mouseUp(event) {
		this.#prevent(event);
		if ( QQ.isNumbers(event.clientX, event.clientY) ) {
			this.#queue.push({
				type: CONST.TOUCH.START,
				id: 0,
				point: this.#getPoint(event.clientX, event.clientY)
			});
		}
	} // void
	
	#prevent(event) {
		if ( event.cancelable ) event.preventDefault();
	} // void
	
	#getPoint(pageX, pageY) {
		return new Point(
			pageX - this.#target.offsetLeft,
			pageY - this.#target.offsetTop,
		);
	} // new Point
	
}
