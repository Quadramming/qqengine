import * as CONST from './CONST/index.js';
import {Point} from './primitives/index.js';

export class Input {
	
	#target;
	#queue;
	#startHandler;
	#moveHandler;
	#endHandler;
	
	constructor(target, queue) {
		this.#target = target;
		this.#queue = queue;
		this.#startHandler = this.#handleStart.bind(this);
		this.#moveHandler = this.#handleMove.bind(this);
		this.#endHandler = this.#handleEnd.bind(this);
		target.addEventListener('touchstart', this.#startHandler, {passive: false});
		target.addEventListener('touchmove', this.#moveHandler, {passive: false});
		target.addEventListener('touchend', this.#endHandler, {passive: false});
		target.addEventListener('touchcancel', this.#endHandler, {passive: false});
	}
	
	destructor() {
		this.#target.removeEventListener('touchstart', this.#startHandler);
		this.#target.removeEventListener('touchmove', this.#moveHandler);
		this.#target.removeEventListener('touchend', this.#endHandler);
		this.#target.removeEventListener('touchcancel', this.#endHandler);
	}
	
	#prevent(event) {
		if ( event.cancelable ) {
			event.preventDefault();
		}
	}
	
	#getPoint(pageX, pageY) {
		return new Point(
			pageX - this.#target.offsetLeft,
			pageY - this.#target.offsetTop,
		);
	}
	
	#handleStart(event) {
		this.#prevent(event);
		for ( const touch of event.changedTouches ) {
			this.#queue.push({
				type: CONST.TOUCH.START,
				id: touch.identifier,
				point: this.#getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
	#handleMove(event) {
		this.#prevent(event);
		for ( const touch of event.changedTouches ) {
			this.#queue.push({
				type: CONST.TOUCH.MOVE,
				id: touch.identifier,
				point: this.#getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
	#handleEnd(event) {
		this.#prevent(event);
		for ( const touch of event.changedTouches ) {
			this.#queue.push({
				type: CONST.TOUCH.END,
				id: touch.identifier,
				point: this.#getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
}
