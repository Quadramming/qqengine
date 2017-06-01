QQ.Sprite.AnimateMngr = class Animate extends QQ.Sprite.Mngr {
	
	constructor(w, h, fps, fullWidth) {
		super(w, h);
		this._fps       = fps;
		this._tpf       = Math.round(1000 / fps);
		this._frames    = fullWidth / w;
		this._startTime = Date.now();
	}
	
	draw(ctx, x, y, img) {
		const diff         = Date.now() - this._startTime;
		const passedFrames = Math.round(diff/this._tpf);
		this._curFrame     = passedFrames % this._frames;
		ctx.drawImage(
			img,
			this._width * this._curFrame, 0,
			this._width, this._height,
			x, y,
			this._width, this._height
		);
	}
	
};
