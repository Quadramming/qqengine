QQ.Actions.Patrol = class Patrol extends QQ.Actions.Base {
	
	constructor(app, options) {
		super(app, options);
		this._from      = options.from;
		this._to        = options.to;
		this._duration  = options.duration;
		this._loopTime  = this._time.now();
	}
	
	tick(delta) {
		let s         = ( x => Math.sign(x) );
		let a         = ( x => Math.abs(x)  );
		let progress  = QQ.Math.calcProgress(this._loopTime, this._duration);
		let xDist     = this._to.x - this._from.x;
		let yDist     = this._to.y - this._from.y;
		let x         = this._from.x + progress * xDist;
		let y         = this._from.y + progress * yDist;
		this._subj.setPosition(x, y);
		if ( progress === 1 ) {
			this.changeDirection();
		}
	}
	
	changeDirection() {
		let progress   = QQ.Math.calcProgress(this._loopTime, this._duration);
		progress       = 1 - progress;
		let curTime    = this._duration * progress;
		this._loopTime = this._time.now() - curTime;
		[this._to, this._from] = [this._from, this._to];
	}
	
	type() {
		return 'patrol';
	}
	
};
