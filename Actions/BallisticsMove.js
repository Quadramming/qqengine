QQ.Actions.BallisticsMove = class BallisticsMove extends QQ.Actions.Base {
	
	constructor(app, options) {
		super(app, options);
		this._from     = this._subj.getPosition();
		this._to       = options.to;
		this._duration = options.duration;
		this._size     = this._subj.getSize();
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
		let value     = (0.5-Math.abs(progress-0.5))*2;
		let sizeW     = this._size.width  + value * this._size.width*2;
		let sizeH     = this._size.height + value * this._size.height*2;
		this._subj.setSize(sizeW, sizeH);
		if ( progress === 1 ) {
			this.finishAction();
		}
	}
	
	finishAction() {
		this._subj.setSize(this._size.width, this._size.height);
		super.finishAction();
	}
	
};
