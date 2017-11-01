QQ.Actions.Move = class Move extends QQ.Actions.Base {
	
	constructor(options) {
		super(options);
		this._from = options.from;
		this._to   = options.to;
	}
	
	tick(delta) {
		super.tick(delta);
		const dist = new QQ.Point(
			this._to.x() - this._from.x(),
			this._to.y() - this._from.y()
		);
		const point = new QQ.Point(
			this._from.x() + this._progress * dist.x(),
			this._from.y() + this._progress * dist.y()
		);
		this._subj.setPosition(point);
	}
	
};
