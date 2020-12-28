// QQDOC

import {Sprite} from './Sprite.js';
import {Rect} from '../primitives/index.js';

export class ClipSprite extends Sprite {
	
	#clip = new Rect();
	
	constructor(image, rect, anchors = true) {
		super(image);
		if ( anchors ) {
			this.#clip.set(
				this._size.x()*rect.x(),
				this._size.y()*rect.y(),
				this._size.x()*rect.w(),
				this._size.y()*rect.h()
			);
		} else {
			this.#clip.copy(rect);
		}
	}
	
	drawImage(context) { // {O}
		context.drawImage(
			this._image,
			this.#clip.x(), this.#clip.y(),
			this.#clip.w(), this.#clip.h(),
			0, 0,
			this._size.w(), this._size.h()
		);
	}
	
}
