// QQDOC

import {Sprite} from './Sprite.js';
import {Rect} from '../primitives/index.js';

export class ClipSprite extends Sprite {
	
	#clip = new Rect();
	#useAnchors;
	
	constructor(image, rect, anchors = true) {
		super(image);
		const size = this.size();
		if ( anchors ) {
			this.#clip.set(
				size.x()*rect.x(),
				size.y()*rect.y(),
				size.x()*rect.w(),
				size.y()*rect.h()
			);
		} else {
			this.#clip.copy(rect);
		}
		this.#useAnchors = anchors;
	}
	
	drawImage(context) { // {O}
		const size = this.size();
		const image = this.image();
		context.drawImage(
			image,
			this.#clip.x(), this.#clip.y(),
			this.#clip.w(), this.#clip.h(),
			0, 0,
			size.w(), size.h()
		);
	} // void
	
	image(image) { // {F}
		const result = super.image(image);
		if ( image !== undefined && this.#useAnchors ) {
			check(false, 'Need to recalc anchors');
		}
		return result;
	} // void
	
}
