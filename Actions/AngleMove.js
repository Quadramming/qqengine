QQ.Actions.AngleMove = class AngleMove extends QQ.Actions.Base {
	
	constructor(input) {
		super(input);
		this._from     = input.from;
		this._to       = input.to;
	}
	
	tick(delta) {
		super.tick(delta);
		const s = Math.sign;
		const a = Math.abs;
		const dist = new QQ.Point(
			this._to.x() - this._from.x(),
			this._to.y() - this._from.y()
		);
		let dist = a(dist.x()) + a(dist.y());
		dist *= this._progress;
		const progress = new QQ.Point(
			dist > a(xDist)     ? a(xDist) : dist,
			dist - a(xDist) < 0 ? 0        : dist - a(xDist)
		);
		const point = new QQ.Point(
			this._from.x() + progress.x() * s(dist.x()),
			this._from.y() + progress.y() * s(dist.y())
		);
		this._subj.setPosition(point);
	}
	
};
