import {Sprite} from './Sprite.js';
import {Rect} from '../Rect.js';

export class ClipSprite extends Sprite {
	
	constructor(image, rect, anchors = true) {
		super(image);
		if ( anchors ) {
			this._clip = new Rect(
				this._imageSize.x()*rect.x(),
				this._imageSize.y()*rect.y(),
				this._imageSize.x()*rect.w(),
				this._imageSize.y()*rect.h()
			);
		} else {
			this._clip = rect.clone();
		}
	}
	
	drawImage(ctx, drawPoint) {
		ctx.drawImage(
			this._image,
			this._clip.x(), this._clip.y(),
			this._clip.w(), this._clip.h(),
			drawPoint.x(), drawPoint.y(),
			this._size.w(), this._size.h()
		);
	}
	
}
