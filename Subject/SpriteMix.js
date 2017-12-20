QQ.Subject.SpriteMix = base => class SpriteMix extends base {
	
	constructor(options) {
		super(options);
		this._img    = options.img;
		this._alpha  = 1;
		this._sprite = new QQ.Sprite(
			this._app.getImg(this._img)
		);
		if ( Number.isNaN(this._size.x()) && Number.isNaN(this._size.y()) ) {
			this._size = this._sprite.getSize();
		} else if ( Number.isNaN(this._size.x()) ) {
			this._size.x( this._size.y() * this._sprite.getSize().getRatio() );
		} else if ( Number.isNaN(this._size.y()) ) {
			this._size.y( this._size.x() / this._sprite.getSize().getRatio() );
		}
		this._sprite.setSize(this._size);
		this._sprite.setAnchor(this._anchor);
		if ( options.alpha !== undefined ) {
			this.setAlpha(options.alpha);
		}
	}
	
	getSprite() {
		return this._sprite;
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
