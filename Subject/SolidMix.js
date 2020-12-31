// QQDOC

import * as Pack from '../Pack/index.js';

export function SolidMix(base) {
	return class SolidMix extends base {
		
		#solid = new Pack.Solid();
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options.solid);
		} // Void
		
		#reset(solid) {
			this.#solid.reset(solid);
		} // Void
		
		solid(solid) { // {F}
			if ( solid !== undefined ) {
				this.#solid.reset(solid);
			}
			return this.#solid;
		} // Solid
		
		getDistance(solid) {
			const position = solid.getSolidPosition();
			return position.getDistance(this.getSolidPosition());
		} // Number
		
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
		} // Number
		
		getSolidType() {
			return this.#solid.type();
		} // CONST.SOLID
		
		getSolidPosition() {
			return this.#solid.position();
		} // Point
		
		isSolid() {
			return true;
		} // Boolean
		
		/*
		draw(wcontext) {
			super.draw(wcontext);
			this.#drawSolidBorder(wcontext);
			this.#drawSolidCenter(wcontext);
		} // Void
		//*/
		
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
		} // Void
		
		#drawSolidCenter(wcontext) {
			wcontext.cleanTransform();
			const point = this.#solid.position();
			const context = wcontext.get();
			context.beginPath();
			context.arc(point.x(), point.y(), 0.1, 0, 2 * Math.PI);
			context.lineWidth = 0.05;
			context.strokeStyle = '#0000FF';
			context.stroke();
		} // Void
	}
}
