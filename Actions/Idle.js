// QQDOC

import {END_STRATEGY} from '../CONST/index.js';

export class Idle {
	
	_subject; // Subject of action
	_duration; // Full action duration time
	_lasting = 0; // How long action is active
	_progress = 0; // Progress of action [0, 1]
	
	#isAbortable; // Is action can be aborted
	#next; // Action after end current action
	#isEnded = false; // End flag
	
	//V\\ void tickFn() // something
	// draw(context)
	// onBegin()
	// onEnd()
	// onAbort()
	
	constructor(options = {}) {
		if ( options.applyTo ) {
			options.applyTo.setPendingAction(this);
			this._subject = options.applyTo;
		} else {
			this._subject = options.subject ?? null;
		}
		this._duration = options.duration ?? null;
		this.#isAbortable = options.isAbortable ?? true;
		if ( options.isRestoreOnEnd ) {
			this.#next = this._subject.getAction();
		} else {
			this.#next = options.next ?? null;
		}
		if ( options.onEnd ) this.onEnd = options.onEnd;
	}
	
	reset() { // {V}
		this._lasting = 0;
		this._progress = 0;
	} // void
	
	setOnEnd(fn) {
		this.onEnd = fn;
	} // void
	
	setNext(next) {
		this.#next = next;
	} // void
	
	endAction() {
		const strategy = this.onEnd?.() ?? END_STRATEGY.NEXT;
		if ( strategy === END_STRATEGY.PREVENT_END ) {
			this.#isEnded = false;
		} else if ( strategy === END_STRATEGY.NEXT ) {
			if ( this.#next ) {
				this._subject.forceAction(this.#next);
			} else {
				this._subject.forceIdleAction();
			}
		} else { // END_STRATEGY.SKIP_NEXT
			// Nothing
		}
	} // void
	
	end() {
		this.#isEnded = true;
	} // void
	
	tick(delta) {
		this._lasting += delta;
		this.tickFn?.(delta);
		if ( this._duration ) {
			this._progress = this._lasting / this._duration;
			if ( this._progress > 1 ) {
				this._progress = 1;
			}
			if ( this._progress === 1 ) {
				this.end();
			}
		}
		if ( this.#isEnded ) {
			this.endAction();
		}
	} // void
	
	subject(subject) { // {F}
		if ( subject !== undefined ) {
			this._subject = subject;
		}
		return this._subject;
	} // Subject

	isAbortable(isAbortable) { // {F}
		if ( isAbortable !== undefined ) {
			this.#isAbortable = isAbortable;
		}
		return this.#isAbortable;
	} // boolean
	
}
