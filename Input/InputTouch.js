// QQDOC

import * as CONST from '../CONST/index.js';
import {InputTouchBase} from './InputTouchBase.js';

export class InputTouch extends InputTouchBase {
	
	_handleStart(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.START,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	} // void
	
	_handleMove(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.MOVE,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	} // void
	
	_handleEnd(event) {
		this._prevent(event);
		for ( const touch of event.changedTouches ) {
			this._queue.push({
				type: CONST.TOUCH.END,
				id: touch.identifier,
				point: this._getPoint(touch.pageX, touch.pageY)
			});
		}
	} // void
	
}
