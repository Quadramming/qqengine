QQ.Actions.MoveTo = class MoveTo extends QQ.Actions.Move {
	
	constructor(options) {
		options.from = options.subj.getPosition();
		super(options);
	}
	
};

QQ.Actions.Shake = class Shake extends QQ.Actions.Base {
	
	constructor(input = {}) {
		super(input);
		this._dispersion = new QQ.Size(1, 1);
		if ( input.dispersion ) {
			this._dispersion.copy(input.dispersion);
		}
		this._period = QQ.default(input.period, 1);
		this._position = this._subj.getPosition();
	}
	
	onStart() {
		this._subj.setPosition(this._calcPosition());
	}
	
	tick(delta) {
		super.tick(delta);
		this._subj.setPosition(this._calcPosition());
	}
	
	_calcPosition() {
		const time = this._lasting * Math.PI*2 / this._period;
		return new QQ.Point(
			this._position.x() + this._dispersion.w() * Math.sin(time)/2,
			this._position.y() + this._dispersion.h() * Math.cos(time)/2
		);
	}
	
};
