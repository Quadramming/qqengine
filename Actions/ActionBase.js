QQ.Actions = {};

QQ.Actions.Base = class Base {
	
	constructor(app, subj) {
		this._app   = app;
		this._time  = app.getTime();
		this._subj  = subj;
		this._start = this._time.now();
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
