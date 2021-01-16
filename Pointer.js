// QQDOC

import {Point} from './primitives/index.js';

const SCREEN_NEAR_PX = 10;

export class Pointer {
	
	#startScreenPoint = new Point();
	#startWorldPoint = new Point();
	#screenPoint = new Point();
	#isActive;
	#isNearStart;
	#seizure;
	
	constructor(seizure) {
		this.#reset(seizure);
	}
	
	destructor() {
		this.#reset(null);
	}
	
	reset(seizure) {
		this.#reset(seizure);
	} // void
	
	#reset(seizure) {
		if ( seizure !== undefined ) this.#seizure = seizure;
		check(this.#seizure !== undefined, 'Seizure undefined');
		this.#isActive = false;
		this.#isNearStart = false;
		this.#screenPoint.set(NaN);
		this.#startScreenPoint.set(NaN);
		this.#startWorldPoint.set(NaN);
	} // void
	
	getScreenPoint() {
		return this.#screenPoint;
	} // Point
	
	getWorldPoint() {
		return this.#seizure.getWorldFromScreen(this.#screenPoint)
	} // Point
	
	getStartWorldPoint() {
		return this.#startWorldPoint
	} // Point
	
	isNearStart() {
		return this.#isNearStart;
	} // boolean
	
	isActive() {
		return this.#isActive;
	} // boolean
	
	isInactive() {
		return ! this.#isActive;
	} // boolean
	
	down(point) {
		this.#startScreenPoint.set(point);
		this.#startWorldPoint.set(this.#seizure.getWorldFromScreen(point));
		this.#screenPoint.set(point);
		this.#isNearStart = true;
		this.#isActive = true;
	} // void
	
	move(point) {
		this.#screenPoint.set(point);
		if ( this.#isNearStart ) {
			this.#isNearStart = this.#screenPoint.isNear(this.#startScreenPoint, SCREEN_NEAR_PX);
		}
	} // void
	
	up(point) {
		this.#screenPoint.set(point);
		this.#isActive = false;
	} // void
	
}
