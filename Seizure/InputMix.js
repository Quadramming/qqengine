// QQDOC

import * as CONST from '../CONST/index.js';
import {Pointer} from '../Pointer.js';

export function InputMix(base) { // Mix InputMix to base
	return class InputMix extends base {
		
		#pointers = new Map();
		#hudPointers = new Set();
		#blockInput;
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		destructor() {
			super.destructor();
			this.#reset();
		}
		
		#reset(options) {
			for ( const pointer of this.#pointers.values() ) {
				pointer.destructor();
			}
			this.#pointers.clear();
			this.#hudPointers.clear();
			this.#blockInput = false;
		} // void
		
		resetInput() {
			this._hud?.resetInput();
			this.#reset();
		} // void
		
		blockInput(value = true) {
			this.#blockInput = value;
			this._hud?.blockInput(value);
			this.#reset();
		} // void
		
		handleInput(input) {
			const queue = input.releaseQueue();
			if ( this.#blockInput ) return;
			for ( const input of queue ) {
				if ( input.type === CONST.TOUCH.START ) {
					this.pointerDown(input.id, input.point);
				} else if ( input.type === CONST.TOUCH.MOVE ) {
					this.pointerMove(input.id, input.point);
				} else if ( input.type === CONST.TOUCH.END ) {
					this.pointerUp(input.id, input.point);
				} else {
					throw Error('Bad input type');
				}
			}
		} // void
		
		pointerDown(id, point) {
			if ( this._hud?.isHitSomething(point) ) { // for HUD
				this.#hudPointers.add(id);
				this._hud?.pointerDown(id, point);
			} else { // for this
				const pointer = new Pointer(this);
				this.#pointers.set(id, pointer);
				pointer.down(point);
				const worldPoint = pointer.getWorldPoint();
				this._world.clickableAtPoint(worldPoint)?.onClickDown(worldPoint, pointer);
			}
		} // void
		
		pointerMove(id, point) {
			if ( this.#hudPointers.has(id) ) { // for HUD
				this._hud?.pointerMove(id, point);
			} else { // for this
				const pointer = this.#pointers.get(id);
				if ( pointer ) pointer.move(point);
			}
		} // void
		
		pointerUp(id, point) {
			if ( this.#hudPointers.has(id) ) { // for HUD
				this._hud?.pointerUp(id, point);
				this.#hudPointers.delete(id);
			} else { // for this
				const pointer = this.#pointers.get(id);
				if ( pointer ) {
					pointer.up(point);
					const worldPoint = pointer.getWorldPoint();
					const clickable = this._world.clickableAtPoint(worldPoint);
					clickable?.onClickUp(pointer.getWorldPoint(), pointer);
					if ( pointer.isNearStart() ) {
						clickable?.onClick(pointer.getWorldPoint(), pointer);
					}
					pointer.destructor();
					this.#pointers.delete(id);
				}
			}
		} // void
		
	}
} // class InputMix extends base
