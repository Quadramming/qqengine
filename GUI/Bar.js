class Bar extends QQ.Subject.Sprite {
	
	constructor(input) {
		input.img = QQ.default(input.img, 'bar');
		input.anchor = QQ.default(input.anchor, new QQ.Point(0.5, 0.5));
		super(input);
		this._maxSize = QQ.default(input.maxSize, 10);
		this._updateFn = QQ.default(input.updateFn, () => {});
	}
	
	setSize(percent) {
		const width = (this._maxSize*percent)/100;
		super.setSize(new QQ.Point(width, 2));
	}
	
	tick(delta) {
		super.tick(delta);
		this._updateFn();
	}
	
};
