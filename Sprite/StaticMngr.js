QQ.Sprite.StaticMngr = class Static extends QQ.Sprite.Mngr {
	
	draw(ctx, x, y, img) {
		ctx.drawImage(
			img,
			x, y,
			this._width, this._height
		);
	}
	
};