QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(input) {
		if ( ! QQ.isObject(input.app) ) {
			alert('Not an app in Action');
		}
		if ( ! QQ.isObject(input.subj) ) {
			alert('Not an object in Action');
		}
		this._app           = app;
		this._time          = app.getTime();
		this._subj          = input.subj;
		this._toRestore     = null;
		this._lasting       = 0;
		this._progress      = 0;
		this._duration      = QQ.default(input.duration, null);
		this._isAbortable   = QQ.default(input.isAbortable, true);
		this.onEnd          = QQ.default(input.onEnd, this.onEnd);
		this.onStart();
		if ( input.isRestoreOnFinish ) {
			this._toRestore = this._subj.getAction();
		}
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
		if ( this._toRestore ) {
			this._subj.forceAction(this._toRestore);
		} else {
			this._subj.forceIdleAction();
		}
		this.onEnd();
	}
	
	tick(delta) {
		this._lasting += delta * 1000;
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
