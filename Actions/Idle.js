// QQDOC

import * as QQ from '../QQ.js';

export class Idle {
	
	_subj; // Subject of action
	_duration; // Full action duration time
	_isAbortable; // Is action can be aborted
	_next; // Action after end current action
	_toRestore = null; // Action to restore on action end
	_lasting = 0; // How long is action active
	_progress = 0; // Progress of action [0, 1]
	
	constructor(input = {}) {
		this._subj = input.subj ?? null;
		this._duration = input.duration ?? null;
		this._isAbortable = input.isAbortable ?? true;
		this._next = input.next ?? null;
		if ( input.isRestoreOnFinish ) {
			this._toRestore = this._subj.getAction();
		}
		if ( input.onEnd ) {
			this.onEnd = input.onEnd;
		}
	}
	
	reset() {
		this._lasting = 0;
		this._progress = 0;
	}
	
	subject(subj) { // {F}
		if ( subj !== undefined ) {
			this._subj = subj;
		}
		return this._subj;
	}

	abortable(value) { // {F}
		if ( value !== undefined ) {
			this._isAbortable = value;
		}
		return this._isAbortable;
	} // boolean
	
	setOnEnd(fn) {
		this.onEnd = fn;
	}
	
	onStart() { // {V}
	}
	
	onEnd() { // {V}
	}
	
	onAbort() { // {V}
	}
	
	finishAction() {
		if ( this._next ) {
			this._subj.forceAction(this._next);
		} else if ( this._toRestore ) {
			this._subj.forceAction(this._toRestore);
		} else {
			this._subj.forceIdleAction();
		}
		this.onEnd();
	}
	
	tick(delta) {
		this._lasting += delta;
		if ( this._duration !== null ) {
			this._progress = this._lasting / this._duration;
			if ( this._progress > 1 ) {
				this._progress = 1;
			}
			if ( this._progress === 1 ) {
				this.finishAction();
			}
		}
	}
	
	draw(ctx) { // {V}
	}
	
}
