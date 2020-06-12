import * as QQ from '../QQ.js';
import {Sprite} from './Sprite.js';
import {Rect} from '../Rect.js';
import {Point} from '../Point.js';

export class LayersSprite extends Sprite {
	
	constructor(image, layer) {
		super(image);
		this._layers = [];
		this.addLayer(layer);
	}
	
	addLayer(layer) {
		if ( layer instanceof Rect ) {
			this._layers.push(layer.clone());
		} else if ( layer instanceof Point ) {
			const previous = QQ.getLast(this._layers);
			this._layers.push(new Rect(
				layer.x(), layer.y(),
				previous.w(), previous.h())
			);
		} else {
			throw new Error('Wrong layer type');
		}
	}
	
	drawImage(ctx, drawPoint, img) {
		for ( const layer of this._layers ) {
			ctx.drawImage(
				this._image,
				layer.x(), layer.y(),
				layer.width(), layer.height(),
				drawPoint.x(), drawPoint.y(),
				this._size.w(), this._size.h()
			);
		}
	}
	
}
