QQ.Actions.Patrol = class Patrol extends QQ.Actions.WalkTo {
	
	constructor(options) {
		super(options);
		this._from = options.from;
	}
	
	finishAction() {
		this.changeDirection();
	}
	
	changeDirection() {
		[this._from, this._to] = [this._to, this._from];
	}
	
};
