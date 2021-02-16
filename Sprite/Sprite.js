// QQDOC

import {Size} from '../primitives/index.js';
import {WCanvas} from '../WCanvas.js';

export class Sprite {
	
	#alpha = 1; // Alpha channel
	#isDisabled = false; // Can hide show
	#image; // Image content
	#size = new Size(); // Size of image
	
	constructor(image = {}) {
		this.image(image);
	}
	
	//D\\ void tick() // {V}
	
	draw(context) {
		if ( ! this.#isDisabled ) {
			if ( context instanceof WCanvas ) {
				context = context.getContext();
			}
			this.drawImage(context);
		}
	} // void
	
	drawImage(context) { // {V}
		context.drawImage(
			this.#image,
			0, 0,
			this.#size.w(), this.#size.h()
		);
	} // void
	
	getRatio() {
		return this.#size.getRatio();
	} // number
	
	getFrameSize() { // {V}
		return this.#size;
	} // Size
	
	alpha(alpha) { // {F}
		if ( alpha !== undefined ) {
			this.#alpha = alpha;
		}
		return this.#alpha;
	} // number
	
	disabled(disabled) { // {F}
		if ( disabled !== undefined ) {
			this.#isDisabled = disabled;
		}
		return this.#isDisabled;
	} // boolean
	
	image(image) { // {F}
		if ( image !== undefined ) {
			if ( image instanceof WCanvas ) {
				image = image.getCanvas();
			} else if ( image instanceof HTMLCanvasElement ) {
				// Nothing
			} else if ( image instanceof HTMLImageElement ) {
				// Nothing
			} else {
				check(image.complete, 'Sprite: image must be completed');
			}
			this.#image = image;
			this.#size.set(image.width, image.height);
		}
		return this.#image;
	} // Image
	
	size(size) { // {F}
		if ( size !== undefined ) {
			this.#size.set(size.w(), size.h());
		}
		return this.#size;
	} // Size
	
}
