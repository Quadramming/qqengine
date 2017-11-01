QQ.Sprite.ClipMngr = class Clip extends QQ.Sprite.Mngr {
	
	constructor(rect, size) {
		super(size);
		this._clip = rect;
	}
	
	draw(ctx, point, img) {
		ctx.drawImage(
			img,
			this._clip.x(), this._clip.y(),
			this._clip.width(), this._clip.height(),
			point.x(), point.y(),
			this._size.w(), this._size.h()
		);
	}
	
};
