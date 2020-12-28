// QQDOC

import * as QQ from '../QQ.js';
import {Sprite} from './Sprite.js';
import {Point, Rect} from '../primitives/index.js';

export class LayersSprite extends Sprite {
	
	#layers = [];
	
	constructor(image, layer) {
		super(image);
		this.addLayer(layer);
	}
	
	addLayer(layer) { // Rect or Point (will get previous layer size) as anchors
		if ( layer instanceof Rect ) {
			this.#layers.push(new Rect(
				this._size.x()*layer.x(),
				this._size.y()*layer.y(),
				this._size.x()*layer.w(),
				this._size.y()*layer.h()
			));
		} else if ( layer instanceof Point ) {
			const previous = QQ.getLast(this.#layers);
			this.#layers.push(new Rect(
				this._size.x()*layer.x(),
				this._size.y()*layer.y(),
				previous.w(), previous.h()
			));
		} else {
			throw Error('Wrong layer type');
		}
	}
	
	drawImage(context) { // {O}
		for ( const layer of this.#layers ) {
			context.drawImage(
				this._image,
				layer.x(), layer.y(),
				layer.width(), layer.height(),
				0, 0,
				this._size.w(), this._size.h()
			);
		}
	}
	
}
