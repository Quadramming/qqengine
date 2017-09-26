QQ.Actions.Move = class Move extends QQ.Actions.Base {
	
	constructor(app, options) {
		super(app, options);
		this._from     = options.from;
		this._to       = options.to;
		this._duration = options.duration;
	}
	
	tick(delta) {
		super.tick(delta);
		let progress  = this._lasting / this._duration;
		if ( progress > 1 ) {
			progress = 1;
		}
		let xDist = this._to.x - this._from.x;
		let yDist = this._to.y - this._from.y;
		let x     = this._from.x + progress * xDist;
		let y     = this._from.y + progress * yDist;
		this._subj.setPosition(x, y);
	}
	
};
