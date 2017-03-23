QQ.Actions.Move = class Move extends QQ.Actions.Base {
	
	constructor(app, subj, from, to, duration) {
		super(app, subj);
		this._from     = from;
		this._to       = to;
		this._duration = duration;
	}
	
	tick(delta) {
		let s         = ( x => Math.sign(x) );
		let a         = ( x => Math.abs(x)  );
		let progress  = QQ.Math.calcProgress(this._start, this._duration);
		let xDist     = this._to.x - this._from.x;
		let yDist     = this._to.y - this._from.y;
		let dist      = a(xDist) + a(yDist);
		dist *= progress;
		let xProgress = dist > a(xDist)     ? a(xDist) : dist;
		let yProgress = dist - a(xDist) < 0 ? 0     : dist - a(xDist);
		let x = this._from.x + xProgress * s(xDist);
		let y = this._from.y + yProgress * s(yDist);
		this._subj.setPosition(x, y);
		if ( progress === 1 ) {
			this._subj.setIdle();
			this.onEnd();
		}
	}
	
	type() {
		return 'move';
	}
	
};
