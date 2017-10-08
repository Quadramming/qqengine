QQ.Subject.TileSpriteMix = base => class TileSpriteMix extends base {
	
	constructor(options) {
		super(options);
		this._tileSprite = new QQ.Sprite(
			this._app.getImg(options.img)
		);
		this._tileSize = new QQ.Point(1, 1);
		this._calcTileSize();
	}
	
	draw(ctx) {
		super.draw(ctx);
		this._tileSprite.draw(ctx);
	}
	
	setTileSize(size) {
		this._tileSize.copy(size);
		this._calcTileSize();
	}
	
	setSize(size) {
		super.setSize(size);
		this._calcTileSize();
	}
	
	getImgSize() {
		return this._tileSprite.getSize();
	}
	
	getScale() {
		const size = this._tileSprite.getSize();
		return new QQ.Point(
			this._size.w() / spriteSize.w(),
			this._size.h() / spriteSize.h()
		);
	}
	
	_calcTileSize() {
		const size   = this._tileSprite.getSize();
		const wRatio = (size.w() / this._size.w());
		const hRatio = (size.h() / this._size.h());
		this._tileSprite.setTileSize(
			this._tileSize.w() * wRatio,
			this._tileSize.h() * hRatio
		);
	}
	
};
