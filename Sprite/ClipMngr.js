QQ.Sprite.ClipMngr = class Clip extends QQ.Sprite.Mngr {
	
	constructor(x, y, w, h) {
		super(w, h);
		this._clip = {x, y, w, h};
	}
	
	draw(ctx, x, y, img) {
		ctx.drawImage(
			img,
			this._clip.x, this._clip.y,
			this._clip.w, this._clip.h,
			x, y,
			this._width, this._height
		);
	}
	
};
