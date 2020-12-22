// QQDOC

import {Idle} from '../Actions/Idle.js';

export function ActionableMix(base) { // Mix Actionable to base
	return class ActionableMix extends base {
		
		#action; // Current action
		#idleAction = new Idle(); // Instance of Idle action
		
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
			if ( this.#action.abortable() ) {
				this.#action.onAbort();
				this.forceAction(action);
				return true;
			}
			return false;
		}
		
		forceAction(action) { // Enforce action set
			this.#action = action;
			this.#action.reset();
			this.#action.subject(this);
			this.#action.onStart();
		} // void
		
		setIdleAction() { // Try to set Idle action
			this.setAction(this.#idleAction);
		}
		
		forceIdleAction() { // Enforce Idle action set
			this.forceAction(this.#idleAction);
		}
		
		setActionOnEnd(fn) {
			if ( this.#action === this.#idleAction ) {
				throw new Error('Do not redefine idle onEnd method');
			} else {
				this.#action.setOnEnd(fn);
			}
		}
		
		tick(delta) {
			super.tick(delta);
			this.#action.tick(delta);
		}
		
		draw(ctx) {
			super.draw(ctx);
			this.#action.draw(ctx);
		}
		
	}
} // class ActionableMix extends base
