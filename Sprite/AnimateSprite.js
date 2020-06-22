import {Sprite} from './Sprite.js';
import {Point} from '../primitives/index.js';

export class AnimateSprite extends Sprite {
	
	constructor(image, frames, fps) {
		super(image);
		this._fps = fps;
		this._tpf = 1 / this._fps; // Time per frame
		this._frames = frames;
		this._passedTime = 0;
		this._currentFrame = 0;
		this._frameWidth = this._size.x()/this._frames;
	}
	
	getFrameSize() {
		return new Point(this._frameWidth, this._size.y());
	}
	
	drawImage(ctx) {
		const passedFrames = Math.round(this._passedTime / this._tpf);
		this._currentFrame = passedFrames % this._frames;
		ctx.drawImage(
			this._image,
			this._frameWidth * this._currentFrame, 0,
			this._frameWidth, this._size.h(),
			0, 0,
			this._frameWidth, this._size.h()
		);
	}
	
	tick(delta) {
		this._passedTime += delta;
	}
	
}
