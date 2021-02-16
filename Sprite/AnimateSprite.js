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
		const size = this.size();
		this.#fps = fps;
		this.#tpf = 1 / fps;
		this.#frames = frames;
		this.#passedTime = 0;
		this.#currentFrame = 0;
		this.#frameWidth = size.x() / frames;
		this.#frameSize.set(this.#frameWidth, size.y());
	}
	
	getFrameSize() { // {O}
		return this.#frameSize;
	} // Size
	
	tick(delta) { // {O}
		super.tick?.(delta);
		this.#passedTime += delta;
	} // void
	
	drawImage(context) { // {O}
		const size = this.size();
		const image = this.image();
		const passedFrames = Math.round(this.#passedTime / this.#tpf);
		this.#currentFrame = passedFrames % this.#frames;
		context.drawImage(
			image,
			this.#frameWidth * this.#currentFrame, 0,
			this.#frameWidth, size.h(),
			0, 0,
			this.#frameWidth, size.h()
		);
	} // void
	
}
