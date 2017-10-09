QQ.Subject.SpriteMix = base => class SpriteMix extends base {
	
	constructor(options) {
		super(options);
		this._img    = options.img;
		this._alpha  = 1;
		this._sprite = new QQ.Sprite(
			this._app.getImg(this._img)
		);
	}
	
	getImg() {
		return this._img;
	}
	
	draw(ctx) {
		super.draw(ctx);
		this._sprite.draw(ctx);
	}
	
	getImgSize() {
		return this._sprite.getSize();
	}
	
	getScale() {
		debugger;
		const spriteSize = this._sprite.getSize();
		return new QQ.Scale(
			this._size.w() / spriteSize.w(),
			this._size.h() / spriteSize.h()
		);
	}
	
	setSpriteAnimation(...args) {
		this._sprite.setAnimation(...args);
	}
	
	setAlpha(a) {
		this._alpha = a;
		this._sprite.setAlpha(a);
	}
	
};
