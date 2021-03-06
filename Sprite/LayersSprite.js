// QQDOC

import * as QQ from '../QQ.js';
import {Sprite} from './Sprite.js';
import {Point, Rect} from '../primitives/index.js';

export class LayersSprite extends Sprite {
	
	#layers = [];
	
	constructor(image, layer) {
		check(QQ.isReadyImage(image), 'Not an ready Image. You can fix it like in animate sprite');
		super(image);
		this.addLayer(layer);
	}
	
	addLayer(layer) { // Rect or Point (will get previous layer size) as anchors
		const size = this.size();
		if ( layer instanceof Rect ) {
			this.#layers.push(new Rect(
				size.x()*layer.x(),
				size.y()*layer.y(),
				size.x()*layer.w(),
				size.y()*layer.h()
			));
		} else if ( layer instanceof Point ) {
			const previous = QQ.getLast(this.#layers);
			this.#layers.push(new Rect(
				size.x()*layer.x(),
				size.y()*layer.y(),
				previous.w(), previous.h()
			));
		} else {
			throw Error('Wrong layer type');
		}
	} // void
	
	drawImage(context) { // {O}
		const size = this.size();
		const image = this.image();
		for ( const layer of this.#layers ) {
			context.drawImage(
				image,
				layer.x(), layer.y(),
				layer.width(), layer.height(),
				0, 0,
				size.w(), size.h()
			);
		}
	} // void
	
	image(image) { // {F}
		const result = super.image(image);
		if ( image !== undefined ) {
			check(false, 'Need to recalc sizes');
		}
		return result;
	} // void
	
}
