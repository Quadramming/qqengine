QQ.Actions.BallisticsMove = class BallisticsMove extends QQ.Actions.Base {
	
	constructor(input) {
		super(input);
		this._from     = this._subj.getPosition();
		this._to       = input.to;
		this._size     = this._subj.getSize().clone();
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
		const value = (0.5 - Math.abs(this._progress-0.5))*2;
		const size = new QQ.Size(
			this._size.w() + value * this._size.w()*2,
			this._size.h() + value * this._size.h()*2
		);
		this._subj.setSize(size);
	}
	
	finishAction() {
		this._subj.setSize(this._size);
		super.finishAction();
	}
	
};
