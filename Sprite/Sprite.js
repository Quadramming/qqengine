import {Point, Size} from '../primitives/index.js';

export class Sprite {
	
	constructor(image) {
		this._alpha = 1;
		this._isDisabled = false;
		this._image = null;
		this._size = new Size();
		
		this.setImage(image);
	}
	
	alpha(alpha) {
		if ( alpha !== undefined ) {
			this._alpha = alpha;
		}
		return this._alpha;
	}
	
	disabled(disabled) {
		if ( disabled !== undefined ) {
			this._isDisabled = disabled;
		}
		return this._isDisabled;
	}
	
	size() {
		return this._size;
	}
	
	setImage(image) {
		if ( image.complete === false ) {
			alert('Sprite: image must be completed');
		}
		this._image = image;
		this._size.set(this._image.width, this._image.height);
	}
	
	getFrameSize() {
		return this._size;
	}
	
	getRatio() {
		return this._size.getRatio();
	}
	
	tick(delta) {
		// Override me
	}
	
	draw(ctx) {
		if ( ! this._isDisabled ) {
			this.drawImage(ctx);
		}
	}
	
	drawImage(ctx) {
		ctx.drawImage(
			this._image,
			0, 0,
			this._size.w(), this._size.h()
		);
	}
	
}
