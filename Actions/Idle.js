import * as QQ from '../QQ.js';

export class Idle {
	
	constructor(input = {}) {
		this._subj = QQ.useDefault(input.subj, null);
		this._lasting = 0;
		this._progress = 0;
		this._duration = QQ.useDefault(input.duration, null);
		this._isAbortable = QQ.useDefault(input.isAbortable, true);
		this._next = null;
		this._toRestore = null;
		
		this.onEnd = QQ.useDefault(input.onEnd, this.onEnd);
		if ( input.isRestoreOnFinish ) {
			this._toRestore = this._subj.getAction();
		}
		if ( input.next ) {
			this._next = input.next;
		}
	}
	
	reset() {
		this._lasting = 0;
		this._progress = 0;
	}
	
	setSubject(subj) {
		this._subj = subj;
	}
	
	setAbortable(value) {
		this._isAbortable = value;
	}
	
	isAbortable() {
		return this._isAbortable;
	}
	
	setOnEnd(fn) {
		this.onEnd = fn;
	}
	
	onStart() {
	}
	
	onEnd() {
	}
	
	onAbort() {
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
	
	draw(ctx) {
	}
	
}
