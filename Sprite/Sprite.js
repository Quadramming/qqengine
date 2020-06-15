import {Point, Size} from '../primitives/index.js';

export class Sprite {
	
	constructor(image) {
		this._alpha = 1;
		this._anchor = new Point(0, 0);
		this._isDisabled = false;
		this._image = null;
		this._imageSize = new Size(0, 0);
		this._outSize = new Size(0, 0);
		
		this.setImage(image);
		this._outSize = this._imageSize.clone();
	}
	
	alpha(alpha) {
		if ( alpha !== undefined ) {
			this._alpha = alpha;
		}
		return this._alpha;
	}
	
	anchor(anchor) {
		if ( anchor !== undefined ) {
			this._anchor.copy(anchor);
		}
		return this._anchor;
	}
	
	disabled(disabled) {
		if ( disabled !== undefined ) {
			this._isDisabled = disabled;
		}
		return this._isDisabled;
	}
	
	size(size) {
		if ( size !== undefined ) {
			this._outSize.copy(size);
		}
		return this._outSize;
	}
	
	setImage(image) {
		if ( image.complete === false ) {
			alert('Sprite: image must be completed');
		}
		this._image = image;
		this._imageSize.set(this._image.width, this._image.height);
	}
	
	getImageSize() {
		return this._imageSize;
	}
	
	getImageFrameSize() {
		return this._imageSize;
	}
	
	getRatio() {
		return this._outSize.getRatio();
	}
	
	getImageRatio() {
		return this._imageSize.getRatio();
	}
	
	tick(delta) {
	}
	
	draw(ctx) {
		if ( ! this._isDisabled ) {
			const changeAlpha = (this._alpha !== 1);
			if ( changeAlpha ) {
				ctx.globalAlpha = this._alpha;
			}
			this.drawImage(ctx, this._calcDrawPoint());
			if ( changeAlpha ) {
				ctx.globalAlpha = 1;
			}
		}
	}
	
	drawImage(ctx, drawPoint) {
		ctx.drawImage(
			this._image,
			drawPoint.x(), drawPoint.y(),
			this._outSize.w(), this._outSize.h()
		);
	}
	
	_calcDrawPoint() {
		return new Point(
			this._anchor.x() * (-this._outSize.x()),
			this._anchor.y() * (-this._outSize.y())
		);
	}
	
}
