// QQDOC

import {Point, Size} from '../primitives/index.js';
import {WCanvas} from '../WCanvas.js';

export class Sprite {
	
	#alpha = 1; // Alpha channel
	#isDisabled = false; // Can hide show
	_image; // Image content
	_size = new Size(); // Size of image
	
	constructor(image) {
		this.image(image);
	}
	
	tick(delta) { // {V}
	}
	
	draw(context) {
		if ( context instanceof WCanvas ) {
			context = context.getContext();
		}
		if ( ! this.#isDisabled ) {
			this.drawImage(context);
		}
	}
	
	drawImage(context) { // {V}
		context.drawImage(
			this._image,
			0, 0,
			this._size.w(), this._size.h()
		);
	}
	
	getSize() {
		return this._size;
	}
	
	getRatio() {
		return this._size.getRatio();
	}
	
	getFrameSize() { // {V}
		return this._size;
	}
	
	alpha(alpha) { // {F}
		if ( alpha !== undefined ) {
			this.#alpha = alpha;
		}
		return this.#alpha;
	}
	
	disabled(disabled) { // {F}
		if ( disabled !== undefined ) {
			this.#isDisabled = disabled;
		}
		return this.#isDisabled;
	}
	
	image(image) { // {F}
		if ( image instanceof WCanvas ) {
			image = image.getCanvas();
		}
		if ( image !== undefined ) {
			check(image.complete !== false, 'Sprite: image must be completed');
			this._image = image;
			this._size.set(image.width, image.height);
		}
		return this._image;
	}
	
}
