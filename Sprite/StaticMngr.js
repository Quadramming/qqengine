QQ.Sprite.StaticMngr = class Static extends QQ.Sprite.Mngr {
	
	draw(ctx, point, img) {
		ctx.drawImage(
			img,
			point.x(), point.y(),
			this._size.w(), this._size.h()
		);
	}
	
};
