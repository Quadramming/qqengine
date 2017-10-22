QQ.Sprite.AnimateMngr = class Animate extends QQ.Sprite.Mngr {
	
	constructor(frames, fps, size, imgSize) {
		super(size);
		this._imgSize    = imgSize.clone();
		this._fps        = fps;
		this._tpf        = (1 / fps);
		this._frames     = frames;
		this._passedTime = 0;
	}
	
	draw(ctx, point, img) {
		const passedFrames = Math.round(this._passedTime/this._tpf);
		this._curFrame     = passedFrames % this._frames;
		ctx.drawImage(
			img,
			this._imgSize.w()/this._frames * this._curFrame, 0,
			this._imgSize.w()/this._frames, this._imgSize.h(),
			point.x(), point.y(),
			this._size.w(), this._size.h()
		);
	}
	
	tick(delta) {
		this._passedTime += delta;
	}
	
};
