QQ.Sprite.AnimateMngr = class Animate extends QQ.Sprite.Mngr {
	
	constructor(frames, fps, size, imgSize) {
		super(size);
		this._imgSize   = imgSize.clone();
		this._fps       = fps;
		this._tpf       = Math.round(1000 / fps);
		this._frames    = frames;
		this._startTime = Date.now();
	}
	
	draw(ctx, point, img) {
		const diff         = Date.now() - this._startTime;
		const passedFrames = Math.round(diff/this._tpf);
		this._curFrame     = passedFrames % this._frames;
		ctx.drawImage(
			img,
			this._imgSize.w()/this._frames * this._curFrame, 0,
			this._imgSize.w()/this._frames, this._imgSize.h(),
			point.x(), point.y(),
			this._size.w(), this._size.h()
		);
	}
	
};
