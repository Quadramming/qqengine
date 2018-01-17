class Bar extends QQ.Subject.Sprite {
	
	constructor(input) {
		input.img = QQ.default(input.img, 'bar');
		input.anchor = QQ.default(input.anchor, new QQ.Point(0.5, 0.5));
		super(input);
		this._percent = 0;
		this._maxSize = QQ.default(input.maxSize, 10);
		this._text = new QQ.Text({
			position: new QQ.Point(0, 0),
			anchor: new QQ.Point(0.5, 0.5),
			size: new QQ.Size(30, 1),
			fontSize: 1.5,
			font: 'KenFuture',
			color: '#6d543a',
			isClickable: false
		});
		this.setText(this._percent);
		this.addSubject(this._text);
	}
	
	setText(percent) {
		if ( percent > 50 ) {
			let text = String(percent);
			if ( text.length > 5 ) {
				text = text.substring(0, 5);
			}
			this._text.setText(text + '%');
			this._text.show();
		} else {
			this._text.hide();
		}
	}
	
	setSize(percent) {
		this._percent = percent;
		this.setText(percent);
		const width = (this._maxSize*percent)/100;
		super.setSize(new QQ.Point(width, 2));
	}
	
};
