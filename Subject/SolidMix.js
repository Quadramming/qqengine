// QQDOC

import * as Pack from '../Pack/index.js';

export function SolidMix(base) { // Mix SolidMix to base
	return class SolidMix extends base {
		
		#solid = new Pack.Solid();
		#isDraw;
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#solid.reset(options.solid);
			this.#isDraw = options.solid?.draw ?? false;
		} // void
		
		draw(wcontext) {
			super.draw(wcontext);
			if ( this.#isDraw ) {
				this.#drawSolidBorder(wcontext);
				this.#drawSolidCenter(wcontext);
			}
		} // void
		
		isSolid() {
			return true;
		} // boolean
		
		getDistance(solid) {
			const position = solid.getSolidPosition();
			return position.getDistance(this.getSolidPosition());
		} // number
		
		getCollision(solid) {
			const myRect = this.getSolidRect();
			const otherRect = solid.getSolidRect();
			return myRect.intersectResolve(otherRect);
		} // new Point
		
		getSolidRect() {
			return this.#solid.rect();
		} // new Rect
		
		getSolidWeight() {
			return this.#solid.weight();
		} // number
		
		getSolidType() {
			return this.#solid.type();
		} // CONST.SOLID
		
		getSolidPosition() {
			return this.#solid.position();
		} // Point
		
		#drawSolidBorder(wcontext) {
			wcontext.cleanTransform();
			const rect = this.#solid.rect();
			const context = wcontext.get();
			context.beginPath();
			context.rect(
				rect.x(),
				rect.y(),
				rect.w(),
				rect.h()
			);
			context.lineWidth = 0.01;
			context.strokeStyle = '#FF0000';
			context.stroke();
		} // void
		
		#drawSolidCenter(wcontext) {
			wcontext.cleanTransform();
			const point = this.#solid.position();
			const context = wcontext.get();
			context.beginPath();
			context.arc(point.x(), point.y(), 0.1, 0, 2 * Math.PI);
			context.lineWidth = 0.05;
			context.strokeStyle = '#0000FF';
			context.stroke();
		} // void
		
		solid(solid) { // {F}
			if ( solid !== undefined ) {
				this.#solid.reset(solid);
			}
			return this.#solid;
		} // Solid
		
	}
} // class SolidMix extends base
