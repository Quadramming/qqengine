import * as CONST from './CONST/index.js';
import {Point} from './primitives/index.js';

export class Input {
	
	constructor(target, queue) {
		this._target = target;
		this._queue = queue;
		this._startHandler = this._handleStart.bind(this);
		this._moveHandler = this._handleMove.bind(this);
		this._endHandler = this._handleEnd.bind(this);
		target.addEventListener('touchstart', this._startHandler, {passive: false});
		target.addEventListener('touchmove', this._moveHandler, {passive: false});
		target.addEventListener('touchend', this._endHandler, {passive: false});
		target.addEventListener('touchcancel', this._endHandler, {passive: false});
	}
	
	destructor() {
		this._target.removeEventListener('touchstart', this._startHandler);
		this._target.removeEventListener('touchmove', this._moveHandler);
		this._target.removeEventListener('touchend', this._endHandler);
		this._target.removeEventListener('touchcancel', this._endHandler);
	}
	
	_prevent(event) {
		if ( event.cancelable ) {
			event.preventDefault();
		}
	}
	
	_getPoint(pageX, pageY) {
		return new Point(
			pageX - this._target.offsetLeft,
			pageY - this._target.offsetTop,
		);
	}
	
	_handleStart(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.START,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
	_handleMove(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.MOVE,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	}
	
	_handleEnd(event) {
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
