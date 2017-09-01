QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(app, subj) {
		this._app         = app;
		this._time        = app.getTime();
		this._start       = this._time.now();
		this._subj        = subj;
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
	
	tick() {
	}
	
	draw(ctx) {
	}
	
	type() {
		return 'base';
	}
	
};
