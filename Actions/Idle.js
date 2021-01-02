// QQDOC

export class Idle {
	
	_subj; // Subject of action
	_duration; // Full action duration time
	_isAbortable; // Is action can be aborted
	_next; // Action after end current action
	_toRestore = null; // Action to restore on action end
	_lasting = 0; // How long is action active
	_progress = 0; // Progress of action [0, 1]
	
	constructor(options = {}) {
		this._subj = options.subj ?? null;
		this._duration = options.duration ?? null;
		this._isAbortable = options.isAbortable ?? true;
		this._next = options.next ?? null;
		if ( options.isRestoreOnFinish ) {
			this._toRestore = this._subj.getAction();
		}
		if ( options.onEnd ) {
			this.onEnd = options.onEnd;
		}
	}
	
	reset() {
		this._lasting = 0;
		this._progress = 0;
	}
	
	subject(subj) { // {F}
		return this.subj(subj);
	}
	
	subj(subj) { // {F}
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
	
	tick(delta) { // {V}
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
