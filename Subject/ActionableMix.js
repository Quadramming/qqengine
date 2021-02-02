// QQDOC

import {Idle} from '../Actions/Idle.js';

export function ActionableMix(base) { // Mix ActionableMix to base
	return class ActionableMix extends base {
		
		#action; // Current action
		#idleAction = new Idle(); // Instance of Idle action
		#pendingAction = null; // Action to be setted
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.forceIdleAction();
		} // void
		
		tick(delta) { // {O}
			super.tick(delta);
			if ( this.#pendingAction ) {
				this.setAction(this.#pendingAction);
				this.#pendingAction = null;
			}
			this.#action.tick(delta);
		} // void
		
		draw(context) { // {O}
			super.draw(context);
			this.#action.draw?.(context);
		} // void
		
		forceIdleAction() { // Enforce Idle action set
			this.forceAction(this.#idleAction);
		} // void
		
		forceAction(action) { // Enforce action set
			this.#action = action;
			this.#action.reset();
			this.#action.subject(this);
			this.#action.onBegin?.();
		} // void
		
		getAction() {
			return this.#action;
		} // Action
		
		setIdleAction() { // Try to set Idle action
			this.setAction(this.#idleAction);
		} // void
		
		setAction(action) {
			if ( this.#action.isAbortable() ) {
				this.#action.onAbort?.();
				this.forceAction(action);
				return true;
			}
			return false;
		} // boolean
		
		setNextAction(action) {
			this.#action.setNext(action);
		} // void
		
		setPendingAction(action) {
			this.#pendingAction = action;
		} // void
		
		setActionOnEnd(fn) {
			if ( this.#action === this.#idleAction ) {
				throw Error('Do not redefine idle onEnd method');
			} else {
				this.#action.setOnEnd(fn);
			}
		} // void
		
	}
} // class ActionableMix extends base
// TODO return type to DOCS
