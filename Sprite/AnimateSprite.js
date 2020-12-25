// QQDOC

import {Sprite} from './Sprite.js';
import {Size} from '../primitives/index.js';

export class AnimateSprite extends Sprite {
	
	#fps;
	#tpf; // Time per frame
	#frames;
	#frameSize = new Size();
	#frameWidth;
	#currentFrame;
	#passedTime;
	
	constructor(image, frames, fps) {
		super(image);
		this.#fps = fps;
		this.#tpf = 1 / fps;
		this.#frames = frames;
		this.#passedTime = 0;
		this.#currentFrame = 0;
		this.#frameWidth = this._size.x() / frames;
		this.#frameSize.set(this.#frameWidth, this._size.y());
	}
	
	destructor() { // {O}
		super.destructor();
		this.#frameSize = null;
	}
	
	getFrameSize() {
		return this.#frameSize;
	}
	
	tick(delta) { // {O}
		super.tick(delta);
		this.#passedTime += delta;
	}
	
	drawImage(ctx) { // {O}
		const passedFrames = Math.round(this.#passedTime / this.#tpf);
		this.#currentFrame = passedFrames % this.#frames;
		ctx.drawImage(
			this._image,
			this.#frameWidth * this.#currentFrame, 0,
			this.#frameWidth, this._size.h(),
			0, 0,
			this.#frameWidth, this._size.h()
		);
	}
	
}
