QQ.Subject.TileSpriteMix = base => class TileSpriteMix extends base {
	
	constructor(options) {
		super(options);
		this._tileSprite = new QQ.Sprite(
			this._app.getImg(options.img)
		);
		this._tileSize = new QQ.Point(1, 1);
		if ( options.tileSize ) {
			this._tileSize.copy(options.tileSize);
		}
		this._tileSprite.setSize(this._size);
		this._tileSprite.setAnchor(this._anchor);
		this._calcTileSize();
	}
	
	draw(ctx) {
		ctx.transform(this.getMatrix());
		this._tileSprite.draw(ctx.get());
		super.draw(ctx);
	}
	
	setTileSize(size) {
		this._tileSize.copy(size);
		this._calcTileSize();
	}
	
	setSize(size) {
		super.setSize(size);
		this._tileSprite.setSize(size);
		this._calcTileSize();
	}
	
	getScale() {
		const size = this._tileSprite.getSize();
		return new QQ.Point(
			this._size.w() / spriteSize.w(),
			this._size.h() / spriteSize.h()
		);
	}
	
	_calcTileSize() {
		this._tileSprite.setTileSize(this._tileSize, this._tileSprite.getSize());
	}
	
};
