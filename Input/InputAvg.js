// QQDOC

import * as CONST from '../CONST/index.js';
import {Point} from '../primitives/index.js';
import {InputBase} from './InputBase.js';

export class InputAvg extends InputBase {
	
	_handleStart(event) {
		this._prevent(event);
		if ( event.touches.length === 1 ) {
			this._queue.push({
				type: CONST.TOUCH.START,
				id: 0,
				point: this._getPoint(event.touches[0].pageX, event.touches[0].pageY)
			});
		} else {
			this._handleMove(event);
		}
	} // void
	
	_handleMove(event) {
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
	} // void
	
	_handleEnd(event) {
		this._prevent(event);
		if ( event.touches.length === 0 ) {
			this._queue.push({
				type: CONST.TOUCH.END,
				id: 0,
				point: this._getPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
			});
		} else {
			this._handleMove(event);
		}
	} // void
	
}
