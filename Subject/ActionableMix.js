// QQDOC

import {Idle} from '../Actions/Idle.js';

export function ActionableMix(base) { // Mix Actionable to base
	return class ActionableMix extends base {
		
		#action; // Current action
		#idleAction = new Idle(); // Instance of Idle action
		#pendingAction = null;
		
		constructor(options) {
			super(options);
			this.#reset(options);
		}
		
		reset(options) { // Reset
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.forceIdleAction();
		}
		
		getAction() {
			return this.#action;
		}
		
		setAction(action) {
			if ( this.#action.isAbortable() ) {
				this.#action.onAbort?.();
				this.forceAction(action);
				return true;
			}
			return false;
		}
		
		setNextAction(action) {
			this.#action.setNext(action);
		}
		
		setPendingAction(action) {
			this.#pendingAction = action;
		}
		
		forceAction(action) { // Enforce action set
			this.#action = action;
			this.#action.reset();
			this.#action.subject(this);
			this.#action.onBegin?.();
		} // void
		
		setIdleAction() { // Try to set Idle action
			this.setAction(this.#idleAction);
		}
		
		forceIdleAction() { // Enforce Idle action set
			this.forceAction(this.#idleAction);
		}
		
		setActionOnEnd(fn) {
			if ( this.#action === this.#idleAction ) {
				throw Error('Do not redefine idle onEnd method');
			} else {
				this.#action.setOnEnd(fn);
			}
		}
		
		tick(delta) {
			super.tick(delta);
			if ( this.#pendingAction ) {
				this.setAction(this.#pendingAction);
				this.#pendingAction = null;
			}
			this.#action.tick(delta);
		}
		
		draw(context) {
			super.draw(context);
			this.#action.draw?.(context);
		}
		
	}
} // class ActionableMix extends base
