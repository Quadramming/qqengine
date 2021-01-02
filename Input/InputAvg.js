// QQDOC

import * as CONST from '../CONST/index.js';
import {Point} from '../primitives/index.js';
import {InputBase} from './InputBase.js';

export class InputAvg extends InputBase {
	
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
		if ( event.touches.length === 1 ) {
			this._queue.push({
				type: CONST.TOUCH.START,
				id: 0,
				point: this._getPoint(event.touches[0].pageX, event.touches[0].pageY)
			});
		} else {
			this.#handleMove(event);
		}
	}
	
	#handleMove(event) {
		this._prevent(event);
		let points = 0;
		const point = Point.ZERO();
		for ( const touch of event.touches ) {
			point.add(touch.pageX, touch.pageY);
			++points;
		}
		this._queue.push({
			type: CONST.TOUCH.MOVE,
			id: 0,
			point: this._getPoint(point.x()/points, point.y()/points)
		});
	}
	
	#handleEnd(event) {
		this._prevent(event);
		if ( event.touches.length === 0 ) {
			this._queue.push({
				type: CONST.TOUCH.END,
				id: 0,
				point: this._getPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
			});
		} else {
			this.#handleMove(event);
		}
	}
	
}
