QQ.Actions.BallisticsMove = class BallisticsMove extends QQ.Actions.Base {
	
	constructor(app, subj, to, duration) {
		super(app, subj);
		this._from     = { x: subj._x, y: subj._y };
		this._to       = to;
		this._duration = duration;
	}
	
	tick(delta) {
		let s         = Math.sign;
		let a         = Math.abs;
		let progress  = QQ.Math.calcProgress(this._start, this._duration);
		let xDist     = this._to.x - this._from.x;
		let yDist     = this._to.y - this._from.y;
		let x         = this._from.x + progress * xDist;
		let y         = this._from.y + progress * yDist;
		this._subj.setPosition(x, y);
		let size = 3 + (0.5-Math.abs(progress-0.5))*8;
		this._subj.setSize(size, size);
		if ( progress === 1 ) {
			this._subj.setIdleAction();
			this.onEnd();
		}
	}
	
	type() {
		return 'ballisticsMove';
	}
	
};
