QQ.Subject.SpriteMix = base => class SpriteMix extends base {
	
	constructor(app, imgSrc, width, height) {
		super(app, width, height);
		this._sprite = new QQ.Sprite( this._app.getImgManager().get(imgSrc) );
		this._alpha = 1;
	}
	
	draw() {
		super.draw();
		const ctx = this._app.getContext();
		this._sprite.draw(ctx);
	}
	
	getImgSize() {
		return this._sprite.getSize();
	}
	
	getScale() {
		let size   = this._sprite.getSize();
		let scaleX = this._width  / size.width;
		let scaleY = this._height / size.height;
		return { x : scaleX, y : scaleY };
	}
	
	setSpriteAnimation(...args) {
		this._sprite.setAnimation(...args);
	}
	
	setAlpha(a) {
		this._alpha = a;
		this._sprite.setAlpha(a);
	}
	
};
