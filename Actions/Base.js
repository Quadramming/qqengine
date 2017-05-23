// FIX ACTIONS
QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(app, subj) {
		this._app   = app;
		this._time  = app.getTime();
		this._start = this._time.now();
		this._subj  = subj;
	}
	
	onStart() {
	}
	
	onEnd() {
	}
	
	onAbort() {
	}
	
	tick() {
	}
	
	draw() {
	}
	
	type() {
		return 'base';
	}
};