QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(app, options) {
		if ( ! QQ.isObject(options.subj) ) {
			debugger;
			alert('Not an object in Action');
		}
		this._app         = app;
		this._time        = app.getTime();
		this._start       = this._time.now();
		this._subj        = options.subj;
		this._isAbortable = true;
		this.onStart();
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
		this._subj.setIdleAction();
		this.onEnd();
	}
	
	tick() {
	}
	
	draw(ctx) {
	}
	
	type() {
		return 'base';
	}
	
};
