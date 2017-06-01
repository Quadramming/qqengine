QQ.Sprite.TileMngr = class TileSprite extends QQ.Sprite.Mngr {
	
	constructor(w, h) {
		super(w, h);
		this._tileWidth  = 100;
		this._tileHeight = 100;
	}
	
	setTileSize(tw = 100, th = tw) {
		this._tileWidth  = tw;
		this._tileHeight = th;
	}
	
	draw(ctx, x, y, img) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(
			-this._width  / 2, -this._height / 2,
			 this._width,       this._height
		);
		ctx.clip();
		let coveredX = 0;
		let coveredY = 0;
		while ( coveredY < this._height ) {
			while ( coveredX < this._width ) {
				ctx.drawImage(
					img,
					-this._width/2 + coveredX, -this._height/2 + coveredY,
					this._tileWidth,            this._tileHeight
				);
				coveredX += this._tileWidth;
			}
			coveredX  = 0;
			coveredY += this._tileHeight;
		}
		ctx.restore();
	}
	
};
