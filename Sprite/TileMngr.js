QQ.Sprite.TileMngr = class TileSprite extends QQ.Sprite.Mngr {
	
	constructor(tileW, tileH, w, h) {
		super(w, h);
		this._tileWidth  = tileW;
		this._tileHeight = tileH;
	}

	draw(ctx, x, y, img) {
		ctx.save(); // save for reset
		ctx.beginPath(); // clean before clip
		ctx.rect(x, y, this._width, this._height);
		ctx.clip();
		let coveredX = 0;
		let coveredY = 0;
		while ( coveredY < this._height ) {
			while ( coveredX < this._width ) {
				ctx.drawImage(
					img,
					x + coveredX, y + coveredY,
					this._tileWidth,            this._tileHeight
				);
				coveredX += this._tileWidth;
			}
			coveredX  = 0;
			coveredY += this._tileHeight;
		}
		ctx.beginPath(); // reset path
		ctx.restore(); // reset clip
	}
	
};
