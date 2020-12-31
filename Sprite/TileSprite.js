// QQDOC

import {Sprite} from './Sprite.js';
import {Point, Size} from '../primitives/index.js';

// TOFIX avoid real pixels
export class TileSprite extends Sprite {
	
	#tileSize = new Size(1, 1);
	#tileOffset = new Point(0, 0);
	
	constructor(image, tileSize, tileOffset) {
		super(image);
		this.setTileSize(tileSize ?? this.#tileSize); // Will recalc this.#tileSize as anchor
		if ( tileOffset ) this.setTileOffset(tileOffset);
	}
	
	setTileSize(tileSize) {
		const size = this.size();
		this.#tileSize.set(
			size.x()*tileSize.x(),
			size.y()*tileSize.y()
		);
	} // Void
	
	setTileOffset(offset) {
		const size = this.size();
		this.#tileOffset.set(
			size.x()*(offset.x() % this.#tileSize.x()) - this.#tileSize.x(),
			size.y()*(offset.y() % this.#tileSize.y()) - this.#tileSize.y()
		);
	} // Void
	
	drawImage(context) { // {O}
		const size = this.size();
		const image = this.image();
		context.save(); // save for resetore
		context.beginPath(); // clean before clip
		context.rect(0, 0, size.w(), size.h());
		context.clip();
		let coveredX = this.#tileOffset.x();
		let coveredY = this.#tileOffset.y();
		while ( coveredY < size.h() ) {
			while ( coveredX < size.w() ) {
				context.drawImage(
					image,
					coveredX, coveredY,
					this.#tileSize.w(), this.#tileSize.h()
				);
				coveredX += this.#tileSize.w();
			}
			coveredX = this.#tileOffset.x();
			coveredY += this.#tileSize.h();
		}
		context.beginPath(); // reset path
		context.restore(); // reset clip
	} // Void
	
}
