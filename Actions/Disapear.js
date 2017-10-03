QQ.Actions.Disapear = class Disapear extends QQ.Actions.Base {
	
	constructor(app, options) {
		super(app, options);
		this._duration = options.duration;
	}
	
	tick(delta) {
		let progress = QQ.Math.calcProgress(this._start, this._duration);
		this._subj.setAlpha(1 - progress);
		if ( progress === 1 ) {
			this.finishAction();
		}
	}
	
};

QQ.Actions.WaitFor = class WaitFor extends QQ.Actions.Base {
	
	constructor(app, options) {
		super(app, options);
		this._duration = options.duration;
	}
	
	tick(delta) {
		let progress = QQ.Math.calcProgress(this._start, this._duration);
		if ( progress === 1 ) {
			this.finishAction();
		}
	}
	
};
