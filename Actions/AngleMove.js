QQ.Actions.AngleMove = class AngleMove extends QQ.Actions.Base {
	
	constructor(input) {
		super(input);
		this._from     = input.from;
		this._to       = input.to;
		this._duration = input.duration;
	}
	
	tick(delta) {
		const s         = Math.sign;
		const a         = Math.abs;
		const progress  = QQ.Math.calcProgress(this._start, this._duration);
		let xDist     = this._to.x - this._from.x;
		let yDist     = this._to.y - this._from.y;
		let dist      = a(xDist) + a(yDist);
		dist *= progress;
		let xProgress = dist > a(xDist)     ? a(xDist) : dist;
		let yProgress = dist - a(xDist) < 0 ? 0        : dist - a(xDist);
		let x         = this._from.x + xProgress * s(xDist);
		let y         = this._from.y + yProgress * s(yDist);
		this._subj.setPosition(x, y);
		if ( progress === 1 ) {
			this.finishAction();
		}
	}
	
};
