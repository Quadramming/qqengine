// QQDOC

import {Size} from '../primitives/index.js';
import {WCanvas} from '../WCanvas.js';

export class Sprite {
	
	#alpha = 1; // Alpha channel
	#isDisabled = false; // Can hide show
	#image; // Image content
	#size = new Size(); // Size of image
	
	constructor(image) {
		this.image(image);
	}
	
	tick(delta) { // {V}
	} // Void
	
	draw(context) {
		if ( ! this.#isDisabled ) {
			if ( context instanceof WCanvas ) {
				context = context.getContext();
			}
			this.drawImage(context);
		}
	} // Void
	
	drawImage(context) { // {V}
		context.drawImage(
			this.#image,
			0, 0,
			this.#size.w(), this.#size.h()
		);
	} // Void
	
	getRatio() {
		return this.#size.getRatio();
	} // Number
	
	getFrameSize() { // {V}
		return this.#size;
	} // Size
	
	alpha(alpha) { // {F}
		if ( alpha !== undefined ) {
			this.#alpha = alpha;
		}
		return this.#alpha;
	} // Number
	
	disabled(disabled) { // {F}
		if ( disabled !== undefined ) {
			this.#isDisabled = disabled;
		}
		return this.#isDisabled;
	} // Boolean
	
	image(image) { // {F}
		if ( image !== undefined ) {
			if ( image instanceof WCanvas ) {
				image = image.getCanvas();
			}
			check(image.complete !== false, 'Sprite: image must be completed');
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
