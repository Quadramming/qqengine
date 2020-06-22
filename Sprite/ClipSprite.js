import {Sprite} from './Sprite.js';
import {Rect} from '../primitives/index.js';

// TOFIX avoid real pixels
export class ClipSprite extends Sprite {
	
	constructor(image, rect, anchors = true) {
		super(image);
		if ( anchors ) {
			this._clip = new Rect(
				this._size.x()*rect.x(),
				this._size.y()*rect.y(),
				this._size.x()*rect.w(),
				this._size.y()*rect.h()
			);
		} else {
			this._clip = rect.clone();
		}
	}
	
	drawImage(ctx) {
		ctx.drawImage(
			this._image,
			this._clip.x(), this._clip.y(),
			this._clip.w(), this._clip.h(),
			0, 0,
			this._size.w(), this._size.h()
		);
	}
	
}
