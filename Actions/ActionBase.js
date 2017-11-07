QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(input = {}) {
		this._app           = QQ.default(input.app, null);
		this._subj          = QQ.default(input.subj, null);
		this._toRestore     = null;
		this._lasting       = 0;
		this._progress      = 0;
		this._duration      = QQ.default(input.duration, null);
		this._isAbortable   = QQ.default(input.isAbortable, true);
		this.onEnd          = QQ.default(input.onEnd, this.onEnd);
		if ( input.isRestoreOnFinish ) {
			this._toRestore = this._subj.getAction();
		}
		if ( input.next ) {
			this._next = input.next;
		}
	}
	
	setApp(app) {
		this._app = app;
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
	
};
