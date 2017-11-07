QQ.Actions.Disappear = class Disappear extends QQ.Actions.Base {
	
	tick(delta) {
		super.tick(delta);
		this._subj.setAlpha(1 - this._progress);
	}
	
	onEnd() {
		this._subj.deleteMe();
	}
	
};

QQ.Actions.Appear = class Appear extends QQ.Actions.Base {
	
	tick(delta) {
		super.tick(delta);
		this._subj.setAlpha(this._progress);
	}
	
	onEnd() {
		this._subj.setAlpha(1);
	}
	
};
