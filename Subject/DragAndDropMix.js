// QQDOC

import * as QQ from '../QQ.js';
import {Point, Rect} from '../primitives/index.js';

function isActive(pointer) {
	return pointer?.isActive() ?? false;
}

function isInactive(pointer) {
	return ! isActive(pointer);
}

function fixOptions(options) {
	options.isClickable = true;
}

export function DragAndDropMix(base) {
	return class DragAndDropMix extends base {
		
		#isActive;
		#pointer;
		#start = new Point();
		#clip;
		
		constructor(options = {}) { // {O}
			fixOptions(options);
			super(options);
			this.#reset(options);
		}
		
		destructor() { // {O}
			super.destructor();
			this.#pointer = null;
			this.#start = null;
			this.#clip = null;
		}
		
		reset(options = {}) { // {O}
			fixOptions(options);
			super.reset(options);
			this.#reset(options);
		}
		
		#reset(options) {
			this.#isActive = false;
			this.#pointer = null;
			this.#start.set(NaN);
			this.#clip = options.clip ? options.clip.clone() : null;
		}
		
		onClickDown(point, pointer) { // {O}
			super.onClickDown(point, pointer);
			this.onDragUp(this.getWorldPosition());
			this.#pointer = pointer;
			this.#start = this.worldToLocal(point);
			this.#isActive = true;
		}
		
		onDragUp(point) { // {V}
			// May be to onClickDown
		}
		
		onDragMove(point) { // {V}
		}
		
		onDragDrop(point) { // {V}
			// May be to onClickUp
		}
		
		tick(delta) { // {O}
			super.tick(delta);
			const pointer = this.#pointer;
			if ( isActive(pointer) ) {
				const offset = Point.subtraction(
					this.worldToLocal(pointer.getWorldPoint()),
					this.#start
				);
				const position = Point.addition(this.position(), offset);
				this.#clampToClip(position);
				this.position(position);
				this.onDragMove();
			} else if ( this.#isActive ) {
				this.#isActive = false;
				this.#pointer = null;
				this.onDragDrop(this.getWorldPosition());
			}
		}
		
		#clampToClip(position) { // Clamp position in #clip if necessary
			if ( this.#clip ) {
				this.#clip.enclose(position);
			}
		}
		
		setClip(rect) {
			if ( this.#clip ) {
				this.#clip.copy(rect);
			} else {
				this.#clip = rect.clone();
			}
		}
		
	}
}
