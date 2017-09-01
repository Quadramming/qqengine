QQ.Subject.TileSpriteMix = base => class TileSpriteMix extends base {
	
	constructor(app, options = {}) {
		super(app, options);
		this._tileSprite = new QQ.Sprite(
				this._app.getImgManager().get(options.imgSrc)
			);
		this._tileWidth  = 1;
		this._tileHeight = 1;
		this._calcTileSize();
	}
	
	draw(ctx) {
		super.draw(ctx);
		this._tileSprite.draw(ctx);
	}
	
	setTileSize(tw = 1, th = tw) {
		this._tileWidth  = tw;
		this._tileHeight = th;
		this._calcTileSize();
	}
	
	setSize(w, h) {
		super.setSize(w, h);
		this._calcTileSize();
	}
	
	getImgSize() {
		return this._tileSprite.getSize();
	}
	
	getScale() {
		let size   = this._tileSprite.getSize();
		let scaleX = this._width  / size.width;
		let scaleY = this._height / size.height;
		return { x : scaleX, y : scaleY };
	}
	
	_calcTileSize() {
		let size   = this._tileSprite.getSize();
		let wRatio = (size.width  / this._width);
		let hRatio = (size.height / this._height);
		this._tileSprite.setTileSize(
			this._tileWidth  * wRatio,
			this._tileHeight * hRatio
		);
	}
	
};
