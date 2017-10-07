QQ.Sprite.TileMngr = class TileSprite extends QQ.Sprite.Mngr {
	
	constructor(tileSize, size) {
		super(size);
		this._tileSize = tileSize.clone();
	}

	draw(ctx, point, img) {
		ctx.save(); // save for reset
		ctx.beginPath(); // clean before clip
		ctx.rect(point.x(), point.y(), this._size.w(), this._size.h());
		ctx.clip();
		let coveredX = 0;
		let coveredY = 0;
		while ( coveredY < this._size.h() ) {
			while ( coveredX < this._size.w() ) {
				ctx.drawImage(
					img,
					point.x() + coveredX, point.y() + coveredY,
					this._tileSize.w(), this._tileSize.h()
				);
				coveredX += this._tileSize.w();
			}
			coveredX  = 0;
			coveredY += this._tileSize.h();
		}
		ctx.beginPath(); // reset path
		ctx.restore(); // reset clip
	}
	
};
