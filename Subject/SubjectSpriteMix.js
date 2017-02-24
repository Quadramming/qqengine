QQ.SubjectSpriteMix = base => class SubjectSpriteMix extends base {
	
	constructor(imgSrc, width, height) {
		super(width, height);
		this._sprite = new QQ.Sprite( QQ.imgManager.get(imgSrc) );
		this._alpha = 1;
	}
	
	draw() {
		super.draw();
		this._sprite.draw();
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
