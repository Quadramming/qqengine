// QQDOC

import * as QQ from '../QQ.js';
import {Point} from '../primitives/index.js';

function fixOptions(options) {
	options.isClickable = true;
}

export function DragAndDropMix(base) {
	return class DragAndDropMix extends base {
		
		#start = new Point();
		#isActive;
		#pointer;
		#clip;
		
		// Can be overridden:
		// onDnDRaise(worldPoint)
		// onDnDMove(worldPoint, offset)
		// onDnDDrop(worldPoint)
		
		constructor(options = {}) {
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#start.set(NaN);
			this.#isActive = false;
			this.#pointer = null;
			this.#clip = options.clip ? options.clip.clone() : null;
		} // void
		
		tick(delta) { // {O}
			super.tick(delta);
			const pointer = this.#pointer;
			if ( QQ.isActive(pointer) ) {
				const offset = Point.subtraction(
					this.worldToLocal(pointer.getWorldPoint()),
					this.#start
				);
				const worldPoint = pointer.getWorldPoint();
				this.onDnDMove?.(worldPoint, offset);
				this._onDnDMove(worldPoint, offset);
			} else if ( this.#isActive ) {
				this.#isActive = false;
				this.#pointer = null;
				this.onDnDDrop?.(this.getWorldPosition());
			}
		} // void
		
		onClickDown(point, pointer) { // {O}
			super.onClickDown(point, pointer);
			this.onDnDRaise?.(this.getWorldPosition());
			this.#start = this.worldToLocal(point);
			this.#isActive = true;
			this.#pointer = pointer;
		} // void
		
		getDragStart() {
			return this.#start;
		} // Point
		
		setClip(rect) {
			if ( this.#clip ) {
				this.#clip.copy(rect);
			} else {
				this.#clip = rect.clone();
			}
		} // void
		
		_onDnDMove(worldPoint, offset) { // {V}
			const position = Point.addition(this.position(), offset);
			this.#clampToClip(position);
			this.position(position);
		} // void
		
		#clampToClip(position) { // Clamp position in #clip if necessary
			this.#clip?.enclose(position);
		} // void
		
	}
}
