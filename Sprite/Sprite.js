import {Point} from '../Point.js';
import {Size} from '../Size.js';

export class Sprite {
	
	constructor(image) {
		this._alpha = 1;
		this._anchor = new Point(0, 0);
		this._isDisabled = false;
		this._size = null; // Output size
		this._image = null;
		this._imageSize = null;
		this.setImage(image);
		this._size = this._imageSize.clone();
	}
	
	isDisabled() {
		return this._isDisabled;
	}
	
	setImage(image) {
		if ( image.complete === false ) {
			alert('Sprite: image must be completed');
		}
		this._image = image;
		this._imageSize = new Size(this._image.width, this._image.height);
	}
	
	setAlpha(alpha) {
		this._alpha = alpha;
	}
	
	setAnchor(point) {
		this._anchor.copy(point);
	}
	
	setDisabled(value) {
		this._isDisabled = value;
	}
	
	setSize(size) {
		this._size.copy(size);
	}
	
	getSize() {
		return this._size;
	}
	
	getImageSize() {
		return this._imageSize;
	}
	
	getImageFrameSize() {
		return this._imageSize;
	}
	
	getRatio() {
		return this._size.getRatio();
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
			this._size.w(), this._size.h()
		);
	}
	
	tick(delta) {
	}
	
	_calcDrawPoint() {
		return new Point(
			this._anchor.x() * (-this._size.x()),
			this._anchor.y() * (-this._size.y())
		);
	}
	
}
