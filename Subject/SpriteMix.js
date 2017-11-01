QQ.Subject.SpriteMix = base => class SpriteMix extends base {
	
	constructor(options) {
		super(options);
		this._img    = options.img;
		this._alpha  = 1;
		this._sprite = new QQ.Sprite(
			this._app.getImg(this._img)
		);
		this._sprite.setSize(this._size);
		this._sprite.setAnchor(this._anchor);
	}
	
	getImg() {
		return this._img;
	}
	
	tick(delta) {
		super.tick(delta);
		this._sprite.tick(delta);
	}
	
	draw(ctx) {
		ctx.transform(this.getMatrix());
		this._sprite.draw(ctx.get());
		super.draw(ctx);
	}
	
	setSize(size) {
		super.setSize(size);
		this._sprite.setSize(size);
	}
	
	setSpriteAnimation(...args) {
		this._sprite.setAnimation(...args);
	}
	
	setClip(rect) {
		this._sprite.setClip(rect, this._size);
	}
	
	setAlpha(a) {
		this._alpha = a;
		this._sprite.setAlpha(a);
	}
	
};
