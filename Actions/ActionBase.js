QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(app, options) {
		if ( ! QQ.isObject(options.subj) ) {
			alert('Not an object in Action');
		}
		this._app           = app;
		this._time          = app.getTime();
		this._start         = this._time.now();
		this._subj          = options.subj;
		this._toRestore     = null;
		this._lasting       = 0;
		this._duration      = QQ.default(options.duration, null);
		this._isAbortable   = QQ.default(options.isAbortable, true);
		this.onEnd          = QQ.default(options.onEnd, this.onEnd);
		this.onStart();
		if ( options.isRestoreOnFinish ) {
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
		this._lasting += delta*1000;
		if ( this._duration < this._lasting ) {
			this.finishAction();
		}
	}
	
	draw(ctx) {
	}
	
	type() {
		return 'action';
	}
	
};
