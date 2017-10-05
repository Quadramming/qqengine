QQ.Actions.Disapear = class Disapear extends QQ.Actions.Base {
	
	tick(delta) {
		super.tick(delta);
		this._subj.setAlpha(1 - this._progress);
	}
	
};
