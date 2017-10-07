QQ.Sprite.AnimateMngr = class Animate extends QQ.Sprite.Mngr {
	
	constructor(size, fps, fullWidth) {
		super(size);
		this._fps       = fps;
		this._tpf       = Math.round(1000 / fps);
		this._frames    = fullWidth / size.width();
		this._startTime = Date.now();
	}
	
	draw(ctx, point, img) {
		const diff         = Date.now() - this._startTime;
		const passedFrames = Math.round(diff/this._tpf);
		this._curFrame     = passedFrames % this._frames;
		ctx.drawImage(
			img,
			this._size.w() * this._curFrame, 0,
			this._size.w(), this._size.h(),
			point.x(), point.y(),
			this._size.w(), this._size.h()
		);
	}
	
};
